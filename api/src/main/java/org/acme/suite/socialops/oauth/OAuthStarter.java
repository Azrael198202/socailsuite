package org.acme.suite.socialops.oauth;

import java.util.Optional;

import org.acme.suite.socialops.domain.Platform;
import org.acme.suite.socialops.dto.PrefillDto;

public interface OAuthStarter {
    Platform platform();
    String buildAuthUrl(String redirectUrl, String state); 
    String callbackForm(String redirectUrl, String code, String continueUrl); 
    String buildRedirectUrl(String continueUrl); 
    String createPrefillFromCode(String code);
    Optional<PrefillDto> takePrefill(String id);
}