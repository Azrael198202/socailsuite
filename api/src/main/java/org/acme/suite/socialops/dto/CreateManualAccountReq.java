package org.acme.suite.socialops.dto;

public record CreateManualAccountReq(
        String name,
        String handle,
        String externalId,
        String avatarUrl
) {}