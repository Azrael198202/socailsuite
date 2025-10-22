package org.acme.suite.socialops.oauth;

import org.acme.suite.socialops.domain.Platform;

public interface OAuthStarter {
    Platform platform();
    String buildAuthUrl(String redirectUrl, String state); 
}