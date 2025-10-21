package org.acme.suite.socialops.utils;

import java.util.UUID;

import org.acme.suite.socialops.domain.Account;
import org.acme.suite.socialops.domain.Platform;
import org.acme.suite.socialops.dto.PlatformAccountDto;

import jakarta.ws.rs.BadRequestException;

public class PlatformUtils {
    public static PlatformAccountDto toDto(Account a) {

        String status;
        if (!a.connected) {
            status = "expired";
        } else {
            status = "active"; 
        }

        return new PlatformAccountDto(
                a.id != null ? a.id : UUID.randomUUID(),
                a.platform,
                a.name,
                a.handle,
                a.access_token,
                a.refresh_token,
                a.connected,
                a.isDefault,
                a.externalId,
                a.avatarUrl,
                a.expires_at,
                status,
                java.util.List.copyOf(a.scopes));
    }

    public static Platform toPlatform(String s) {
        try {
            return Platform.valueOf(s.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Unknown platform: " + s);
        }
    }
}
