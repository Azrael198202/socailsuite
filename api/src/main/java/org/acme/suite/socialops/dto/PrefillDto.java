package org.acme.suite.socialops.dto;

import java.util.List;

public record PrefillDto(
        String name,
        String handle,
        String externalId,
        String avatarUrl,
        List<String> scopes) {
}