package org.acme.suite.socialops.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

import org.acme.suite.socialops.domain.Platform;

public record PlatformAccountDto(
        UUID id,
        Platform platform,
        String name,
        String handle,
        String access_token,
        String refresh_token,
        boolean connected,
        boolean isDefault,
        String externalId,
        String avatarUrl,
        OffsetDateTime expires_at,
        String status,
        java.util.List<String> scopes // 'active'|'expired'|'revoked'
        ) {
}