package org.acme.suite.socialops.dto;

import java.time.OffsetDateTime;

import org.acme.suite.socialops.domain.Platform;
import org.acme.suite.socialops.domain.PublishStatus;

public record ScheduledPostDto(
    String id, 
    String title, 
    Platform platform, 
    OffsetDateTime date, 
    String description, 
    PublishStatus status,
    String tags) {}