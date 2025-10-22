package org.acme.suite.socialops.oauth;

import jakarta.enterprise.context.ApplicationScoped;
import org.acme.suite.socialops.domain.Platform;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@ApplicationScoped
public class YouTubeOAuthStarter implements OAuthStarter {

    @ConfigProperty(name = "oauth.youtube.client-id")
    String clientId;

    @Override
    public Platform platform() {
        return Platform.youtube;
    }

    @Override
    public String buildAuthUrl(String redirectUrl, String state) {
        String scope = String.join(" ",
                "https://www.googleapis.com/auth/youtube.upload",
                "https://www.googleapis.com/auth/yt-analytics.readonly",
                "https://www.googleapis.com/auth/youtube.readonly"
        );

        return "https://accounts.google.com/o/oauth2/v2/auth"
                + "?client_id=" + enc(clientId)
                + "&redirect_uri=" + enc(redirectUrl)
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
}