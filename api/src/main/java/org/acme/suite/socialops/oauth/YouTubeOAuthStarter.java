package org.acme.suite.socialops.oauth;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import org.acme.suite.socialops.domain.Account;
import org.acme.suite.socialops.domain.Platform;
import org.acme.suite.socialops.dto.PrefillDto;
import org.acme.suite.socialops.repo.AccountRepo;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.json.JSONObject;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@ApplicationScoped
public class YouTubeOAuthStarter implements OAuthStarter {

    @Inject
    AccountRepo repo;

    @ConfigProperty(name = "oauth.youtube.client-id")
    String clientId;

    @ConfigProperty(name = "oauth.youtube.client-secret")
    String secretId;

    @ConfigProperty(name = "oauth.redirect-base")
    String redirectBase;

    private static record CacheEntry(PrefillDto data, long exp) {
    }

    private final Map<String, CacheEntry> cache = new ConcurrentHashMap<>();

    @Override
    public Platform platform() {
        return Platform.youtube;
    }

    @Override
    public String buildAuthUrl(String redirectUrl, String state) {
        String continueUrl = redirectUrl;
        String redirectUri = redirectBase + "/api/accounts/youtube/oauth/callback";

        String stateJson = new org.json.JSONObject()
                .put("nonce", java.util.UUID.randomUUID().toString())
                .put("continue", continueUrl)
                .toString();

        state = java.util.Base64.getUrlEncoder().withoutPadding()
                .encodeToString(stateJson.getBytes(java.nio.charset.StandardCharsets.UTF_8));

        String scope = String.join(" ",
                "https://www.googleapis.com/auth/youtube.upload",
                "https://www.googleapis.com/auth/yt-analytics.readonly",
                "https://www.googleapis.com/auth/youtube.readonly");

        return "https://accounts.google.com/o/oauth2/v2/auth"
                + "?client_id=" + enc(clientId)
                + "&redirect_uri=" + enc(redirectUri)
                + "&response_type=code"
                + "&scope=" + enc(scope)
                + "&access_type=offline"
                + "&include_granted_scopes=true"
                + "&prompt=consent"
                + "&state=" + enc(state);
    }

    private static String enc(String s) {
        return URLEncoder.encode(s, StandardCharsets.UTF_8);
    }

    @Override
    public String callbackForm(String redirectUrl, String code, String continueUrl) {
        String redirectUri = redirectBase + "/api/accounts/youtube/oauth/callback?continue=" + enc(continueUrl);
        String form = "code=" + enc(code)
                + "&client_id=" + enc(clientId)
                + "&client_secret=" + enc(secretId)
                + "&redirect_uri=" + enc(redirectUri)
                + "&grant_type=authorization_code";

        return form;
    }

    @Override
    public String buildRedirectUrl(String continueUrl) {
        return redirectBase + "/api/accounts/youtube/oauth/callback?continue=" + enc(continueUrl);
    }

    @Override
    @Transactional
    public String createPrefillFromCode(String code) {
        try {
            String redirectUri = redirectBase + "/api/accounts/youtube/oauth/callback";

            String form = "code=" + enc(code)
                    + "&client_id=" + enc(clientId)
                    + "&client_secret=" + enc(secretId)
                    + "&redirect_uri=" + enc(redirectUri)
                    + "&grant_type=authorization_code";

            HttpClient http = HttpClient.newHttpClient();
            var tokenResp = http.send(
                    HttpRequest.newBuilder(URI.create("https://oauth2.googleapis.com/token"))
                            .header("Content-Type", "application/x-www-form-urlencoded")
                            .POST(HttpRequest.BodyPublishers.ofString(form))
                            .build(),
                    HttpResponse.BodyHandlers.ofString());

            if (tokenResp.statusCode() / 100 != 2) {
                throw new RuntimeException("token exchange failed: " + tokenResp.body());
            }

            var tokenJson = new JSONObject(tokenResp.body());
            String accessToken = tokenJson.getString("access_token");
            String scopeStr = tokenJson.optString("scope", "");

            var chResp = http.send(
                    HttpRequest.newBuilder(URI.create(
                            "https://www.googleapis.com/youtube/v3/channels?mine=true&part=snippet"))
                            .header("Authorization", "Bearer " + accessToken)
                            .GET().build(),
                    HttpResponse.BodyHandlers.ofString());

            if (chResp.statusCode() / 100 != 2) {
                throw new RuntimeException("channels api failed: " + chResp.body());
            }

            var ch = new JSONObject(chResp.body()).getJSONArray("items").getJSONObject(0);
            var snippet = ch.getJSONObject("snippet");

            String externalId = ch.getString("id");
            String name = snippet.getString("title");
            String handle = snippet.optString("customUrl", "");
            if (!handle.isEmpty() && !handle.startsWith("@")) {
                handle = "@" + handle.replaceFirst("^@", "");
            }
            String avatarUrl = snippet.getJSONObject("thumbnails")
                    .getJSONObject("default").getString("url");

            List<String> scopes = scopeStr.isBlank()
                    ? List.of()
                    : Arrays.asList(scopeStr.split("\\s+"));

            Account a = new Account();
            a.platform = Platform.youtube;
            a.name = name;
            a.handle = handle;
            a.externalId = externalId;
            a.avatarUrl = avatarUrl;
            a.connected = true;
            a.isDefault = false;
            a.access_token = accessToken;
            a.refresh_token = tokenJson.optString("refresh_token", null);
            Instant instant = Instant.ofEpochSecond(Instant.now().getEpochSecond() + tokenJson.getLong("expires_in"));
            a.expires_at = OffsetDateTime.ofInstant(instant, ZoneOffset.UTC);
            a.created_at = OffsetDateTime.now();
            a.updated_at = a.created_at;
            repo.persist(a);

            PrefillDto dto = new PrefillDto(name, handle, externalId, avatarUrl, scopes);

            String prefillId = UUID.randomUUID().toString();
            cache.put(prefillId, new CacheEntry(dto, Instant.now().getEpochSecond() + 300));
            return prefillId;
        } catch (InterruptedException ie) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("HTTP call interrupted", ie);
        } catch (IOException ioe) {
            throw new RuntimeException("HTTP I/O error", ioe);
        }
    }

    public Optional<PrefillDto> takePrefill(String id) {
        CacheEntry e = cache.remove(id);
        if (e == null)
            return Optional.empty();
        if (e.exp < Instant.now().getEpochSecond())
            return Optional.empty();
        return Optional.of(e.data);
    }
}