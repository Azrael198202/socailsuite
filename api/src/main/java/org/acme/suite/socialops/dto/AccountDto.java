package org.acme.suite.socialops.dto;

import org.acme.suite.socialops.domain.Platform;

public record AccountDto(Platform platform, String name, boolean connected, String avatarUrl,boolean exists) {
}