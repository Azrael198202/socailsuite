package org.acme.suite.socialops.domain;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
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
    @Column(columnDefinition = "text")
    public String access_token;
    @Column(columnDefinition = "text")
    public String refresh_token;
    public boolean connected;
    public OffsetDateTime created_at;
    public OffsetDateTime updated_at;
}