// src/main/java/org/acme/suite/socialops/oauth/TikTokOAuthStarter.java
package org.acme.suite.socialops.oauth;

import jakarta.enterprise.context.ApplicationScoped;
import org.acme.suite.socialops.domain.Platform;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@ApplicationScoped
public class TikTokOAuthStarter implements OAuthStarter {

    @ConfigProperty(name = "oauth.tiktok.client-key")
    String clientKey;

    // 逗号分隔由 TikTok 要求，比如 "user.info.basic,video.list"
    @ConfigProperty(name = "oauth.tiktok.scopes", defaultValue = "user.info.basic,video.list")
    String scopesCsv;

    @Override
    public Platform platform() {
        return Platform.tiktok;
    }

    @Override
    public String buildAuthUrl(String redirectUrl, String state) {
        // 文档： https://www.tiktok.com/v2/auth/authorize/
        return "https://www.tiktok.com/v2/auth/authorize/"
                + "?client_key=" + enc(clientKey)
                + "&scope=" + enc(scopesCsv)            // 逗号分隔
                + "&response_type=code"
                + "&redirect_uri=" + enc(redirectUrl)
                + "&state=" + enc(state);
    }

    private static String enc(String s) {
        return URLEncoder.encode(s, StandardCharsets.UTF_8);
    }
}
