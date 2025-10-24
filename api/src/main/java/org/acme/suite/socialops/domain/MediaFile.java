package org.acme.suite.socialops.domain;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "media_file")
public class MediaFile extends PanacheEntityBase {
    @Id
    @Column(columnDefinition = "uuid")
    public UUID id;
    public String filename;
    public String contentType; 
    public long size;
    public String storagePath;
    public OffsetDateTime created_at;
}
