package org.acme.suite.socialops.repo;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.UUID;

import org.acme.suite.socialops.domain.MediaFile;

@ApplicationScoped
public class MediaFileRepo implements PanacheRepositoryBase<MediaFile, UUID> {}
