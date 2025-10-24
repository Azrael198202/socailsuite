package org.acme.suite.socialops.domain;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.*;
import java.util.*;

@Entity
@Table(name = "scheduled_post")
public class ScheduledPost extends PanacheEntityBase {
    @Id
    @Column(columnDefinition = "uuid")
    public UUID id;

    public String title;

    @Enumerated(EnumType.STRING)
    public Platform platform;

    public OffsetDateTime date; // Scheduled date

    @Column(columnDefinition = "text")
    public String description;

    @Column(columnDefinition = "text")
    public String tags;

    public String status;

    @Column(columnDefinition = "uuid")
    public UUID mediaId;
    @Column(columnDefinition = "uuid")
    public UUID accountId;

    @Column(columnDefinition = "text")
    public String lastError;

    public OffsetDateTime created_at;
    public OffsetDateTime updated_at;

}