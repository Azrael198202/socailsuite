package org.acme.suite.socialops.repo;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;
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

    public List<ScheduledPost> listRange(LocalDate from, LocalDate to, ZoneId zone) {
        OffsetDateTime start = from.atStartOfDay(zone).toOffsetDateTime();
        OffsetDateTime end = to.plusDays(1).atStartOfDay(zone).toOffsetDateTime();
        return list("date >= ?1 and date < ?2 order by date asc", start, end);
    }
    public List<ScheduledPost> dueUntilNow() {
        return list("status = ?1 and date <= ?2 order by date asc",
                "PENDING", OffsetDateTime.now());
    }
}
