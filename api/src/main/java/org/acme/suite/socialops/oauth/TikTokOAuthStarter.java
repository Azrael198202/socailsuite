// src/main/java/org/acme/suite/socialops/oauth/TikTokOAuthStarter.java
package org.acme.suite.socialops.oauth;

import jakarta.enterprise.context.ApplicationScoped;
import org.acme.suite.socialops.domain.Platform;
import org.acme.suite.socialops.dto.PrefillDto;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

@ApplicationScoped
public class TikTokOAuthStarter implements OAuthStarter {

    @ConfigProperty(name = "oauth.tiktok.client-key")
    String clientKey;

    @ConfigProperty(name = "oauth.tiktok.scopes", defaultValue = "user.info.basic,video.list")
    String scopesCsv;

    @Override
    public Platform platform() {
        return Platform.tiktok;
    }

    @Override
    public String buildAuthUrl(String redirectUrl, String state) {
        return "https://www.tiktok.com/v2/auth/authorize/"
                + "?client_key=" + enc(clientKey)
                + "&scope=" + enc(scopesCsv) 
                + "&response_type=code"
                + "&redirect_uri=" + enc(redirectUrl)
                + "&state=" + enc(state);
    }

    private static String enc(String s) {
        return URLEncoder.encode(s, StandardCharsets.UTF_8);
    }

    @Override
    public String callbackForm(String redirectUrl, String code, String continueUrl) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'callbackForm'");
    }

    @Override
    public String buildRedirectUrl(String continueUrl) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'buildRedirectUrl'");
    }

    @Override
    public String createPrefillFromCode(String code) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'createPrefillFromCode'");
    }

    @Override
    public Optional<PrefillDto> takePrefill(String id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'takePrefill'");
    }
}
