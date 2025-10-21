package org.acme.suite.socialops.resources;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;

import java.net.URI;
import java.time.OffsetDateTime;
import java.util.*;
import org.acme.suite.socialops.domain.*;
import org.acme.suite.socialops.dto.*;
import org.acme.suite.socialops.repo.*;
import org.acme.suite.socialops.utils.PlatformUtils;

import org.glassfish.jersey.uri.UriComponent;

@Path("/api/accounts")
@Produces(MediaType.APPLICATION_JSON)
public class AccountsResource {
    @Inject
    AccountRepo repo;

    /**
     * List all platforms with connected account info
     * 
     * @return List of AccountDto
     */
    @GET
    public List<AccountDto> list() {
        List<Account> all = repo.listAll();
        List<AccountDto> out = new ArrayList<>();
        for (Platform p : Platform.values()) {
            Account a = all.stream().filter(x -> x.platform == p && x.connected).findFirst().orElse(null);
            out.add(new AccountDto(p, a != null ? a.name : p.name(), a != null && a.connected, null));
        }
        return out;
    }

    /**
     * List accounts by platform
     * 
     * @param platform Platform name
     * @return List of PlatformAccountDto
     */
    @GET
    @Path("/{platform}")
    public List<PlatformAccountDto> listByPlatform(@PathParam("platform") String platform) {
        Platform p;
        try {
            p = Platform.valueOf(platform.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Unknown platform: " + platform);
        }

        List<Account> rows = repo.listByPlatform(p);
        List<PlatformAccountDto> out = new ArrayList<>(rows.size());
        for (Account a : rows) {
            out.add(PlatformUtils.toDto(a));
        }
        return out;
    }

    /**
     * Create manual account
     * 
     * @param platform Platform name
     * @param req      Request body
     * @return Created PlatformAccountDto
     */
    @POST
    @Path("/{platform}/manual")
    public PlatformAccountDto createManual(@PathParam("platform") String platform, CreateManualAccountReq req) {
        Platform p = PlatformUtils.toPlatform(platform);
        Account a = new Account();
        a.platform = p;
        a.name = req.name();
        a.handle = req.handle();
        a.externalId = req.externalId();
        a.avatarUrl = req.avatarUrl();
        a.connected = true;
        a.isDefault = false;
        a.created_at = OffsetDateTime.now();
        a.updated_at = a.created_at;
        repo.persist(a);
        return PlatformUtils.toDto(a);
    }

    /**
     * OAuth Start - return 3rd party auth URL
     * 
     * @param platform Platform name
     * @param req      Request body
     * @return OAuthStartResp with authUrl
     */
    @POST
    @Path("/{platform}/oauth/start")
    public OAuthStartResp oauthStart(@PathParam("platform") String platform, OAuthStartReq req) {
        String state = UUID.randomUUID().toString();
        String authUrl = "https://accounts.google.com/o/oauth2/v2/auth"
                + "?client_id=" + /* from config */
                "&redirect_uri=" + UriComponent.encode(req.redirectUrl(), UriComponent.Type.QUERY_PARAM)
                + "&response_type=code"
                + "&scope="
                + UriComponent.encode(
                        "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/yt-analytics.readonly",
                        UriComponent.Type.QUERY_PARAM)
                + "&access_type=offline&prompt=consent"
                + "&state=" + state;

        return new OAuthStartResp(authUrl);
    }

    /**
     * OAuth Callback - handle 3rd party redirect
     * 
     * @param platform Platform name
     * @param code     Code from 3rd party
     * @param state    State from 3rd party
     * @param redirect Redirect URL to frontend
     * @return Response redirecting to frontend
     */
    @GET
    @Path("/{platform}/oauth/callback")
    public Response oauthCallback(@PathParam("platform") String platform,
            @QueryParam("code") String code,
            @QueryParam("state") String state,
            @QueryParam("redirect") @DefaultValue("http://localhost:3000/accounts") String redirect) {
        Platform p = PlatformUtils.toPlatform(platform);
        if (code == null || code.isBlank())
            throw new BadRequestException("code required");

        // Code to Token（Google Token Endpoint）
        String accessToken = "mock-access";
        String refreshToken = "mock-refresh";
        OffsetDateTime expiresAt = OffsetDateTime.now().plusHours(1);

        // Mock Get user infomation
        String channelId = "UC_xxx";
        String name = "Megumi Studio";
        String handle = "@megumi";
        String avatar = "https://i.ytimg.com/vi/xxx/default.jpg";

        Account a = new Account();
        a.platform = p;
        a.name = name;
        a.handle = handle;
        a.externalId = channelId;
        a.avatarUrl = avatar;
        a.connected = true;
        a.isDefault = false;
        a.access_token = accessToken;
        a.refresh_token = refreshToken;
        a.expires_at = expiresAt;
        a.created_at = OffsetDateTime.now();
        a.updated_at = a.created_at;
        repo.persist(a);

        // Redirect to frontend
        return Response.seeOther(URI.create(redirect + "/" + platform)).build();
    }

    /**
     * Define default account
     * 
     * @param platform Platform name
     * @param id       Account ID
     * @return Updated PlatformAccountDto
     */
    @PUT
    @Path("/{platform}/{id}/default")
    public PlatformAccountDto setDefault(@PathParam("platform") String platform, @PathParam("id") Long id) {
        Platform p = PlatformUtils.toPlatform(platform);
        repo.clearDefault(p);
        Account a = repo.findById(id);
        if (a == null || a.platform != p)
            throw new NotFoundException();
        a.isDefault = true;
        a.updated_at = OffsetDateTime.now();
        repo.persist(a);
        return PlatformUtils.toDto(a);
    }

    /**
     * Refresh access token
     * 
     * @param platform Platform name
     * @param id       Account ID
     * @return Updated PlatformAccountDto
     */
    @POST
    @Path("/{platform}/{id}/refresh")
    public PlatformAccountDto refreshToken(@PathParam("platform") String platform, @PathParam("id") Long id) {
        Account a = repo.findById(id);
        if (a == null)
            throw new NotFoundException();

        // Mock refresh token process
        a.access_token = "mock-access-" + System.currentTimeMillis();
        a.expires_at = OffsetDateTime.now().plusHours(1);
        a.updated_at = OffsetDateTime.now();
        repo.persist(a);
        return PlatformUtils.toDto(a);
    }

    /**
     * Delete account
     * 
     * @param platform Platform name
     * @param id       Account ID
     * @return Status map
     */
    @DELETE
    @Path("/{platform}/{id}")
    public Map<String, String> delete(@PathParam("platform") String platform, @PathParam("id") Long id) {
        Account a = repo.findById(id);
        if (a != null)
            repo.delete(a);
        return Map.of("status", "ok");
    }

    /**
     * Get token status summary
     * 
     * @param platform Platform name
     * @return TokenStatusDto with valid and expired counts
     */
    @GET
    @Path("/{platform}/tokens/status")
    public TokenStatusDto tokenStatus(@PathParam("platform") String platform) {
        Platform p = PlatformUtils.toPlatform(platform);
        List<Account> rows = repo.listByPlatform(p);
        int valid = 0, expired = 0;
        for (Account a : rows) {
            if (a.expires_at != null && a.expires_at.isAfter(OffsetDateTime.now()))
                valid++;
            else
                expired++;
        }
        return new TokenStatusDto(valid, expired);
    }
}
