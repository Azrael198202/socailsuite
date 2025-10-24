package org.acme.suite.socialops.dto;

import java.time.OffsetDateTime;

import org.acme.suite.socialops.domain.Platform;

public record ScheduledPostDto(String id, String title, Platform platform, OffsetDateTime date, String description, String tags) {}