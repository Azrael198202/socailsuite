package org.acme.suite.socialops.domain;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "account")
public class Account extends PanacheEntityBase {
    @Id
    @Column(columnDefinition = "uuid")
    public UUID id;

    @Enumerated(EnumType.STRING)
    public Platform platform;

    public String name;

    public String handle;

    @Column(columnDefinition = "text")
    public String access_token;

    @Column(columnDefinition = "text")
    public String refresh_token;

    public boolean connected;

    public boolean isDefault;

    @Column(columnDefinition = "text")
    public String externalId;

    @Column(columnDefinition = "text")
    public String avatarUrl;

    public OffsetDateTime expires_at;

    public OffsetDateTime created_at;

    public OffsetDateTime updated_at;

    @ElementCollection
    @CollectionTable(name = "account_scopes", joinColumns = @JoinColumn(name = "account_id"))
    @Column(name = "scope", columnDefinition = "text", nullable = false)
    public Set<String> scopes = new HashSet<>();
}