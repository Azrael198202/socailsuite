package org.acme.suite.socialops.dto;

import java.time.LocalDate;
import org.acme.suite.socialops.domain.Platform;

public record ScheduledPostDto(String id, String title, Platform platform, LocalDate date, String description, String tags) {}