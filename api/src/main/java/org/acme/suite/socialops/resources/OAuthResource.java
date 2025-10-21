package org.acme.suite.socialops.resources;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import jakarta.inject.Inject;
import org.acme.suite.socialops.domain.*;
import org.acme.suite.socialops.service.*;
import java.net.URI;

@Path("/api/oauth")
@Produces(MediaType.APPLICATION_JSON)
public class OAuthResource {
    @Inject
    OAuthService oauth;

    record UrlResp(String url) {
    }

    record Ok(boolean ok) {
    }

    @POST
    @Path("/{platform}/authorize")
    public UrlResp authorize(@PathParam("platform") String platform) {
        Platform p = Platform.valueOf(platform);
        return new UrlResp(oauth.buildAuthorizeUrl(p));
    }

    @POST
    @Path("/{platform}/revoke")
    public Ok revoke(@PathParam("platform") String platform) {
        oauth.revoke(Platform.valueOf(platform));
        return new Ok(true);
    }

    // 平台回调入口（示例）：/api/oauth/callback?platform=...&code=...
    @GET
    @Path("/callback")
    public Response callback(@QueryParam("platform") String platform, @QueryParam("code") String code) {
        // TODO: 用 code 交换 token，然后保存
        oauth.saveTokens(Platform.valueOf(platform), platform + "-acc", "ACCESS", "REFRESH");
        return Response.seeOther(URI.create("http://localhost:3000/accounts")).build();
    }
}