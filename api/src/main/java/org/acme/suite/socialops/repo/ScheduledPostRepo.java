package org.acme.suite.socialops.repo;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import org.acme.suite.socialops.domain.ScheduledPost;

@ApplicationScoped
public class ScheduledPostRepo implements PanacheRepositoryBase<ScheduledPost, UUID> {
    public List<ScheduledPost> upcoming() {
        OffsetDateTime now = OffsetDateTime.now();
        return list("date >= ?1 order by date", now);
    }

    public boolean deleteById(UUID id) {
        return delete("id", id) > 0;
    }
}
