package org.acme.suite.socialops.service;

import jakarta.enterprise.context.ApplicationScoped;
import org.acme.suite.socialops.domain.*;
import org.acme.suite.socialops.repo.*;
import jakarta.inject.Inject;

import java.time.OffsetDateTime;
import java.util.*;

@ApplicationScoped
public class PublishService {
    @Inject
    ScheduledPostRepo posts;

    public List<ScheduledPost> dueToday() {
        OffsetDateTime now = OffsetDateTime.now();
        return posts.list("date = ?1 and status = 'PENDING'", now);
    }

    public void markPublished(ScheduledPost p) {
        p.status = "PUBLISHED";
        posts.persist(p);
    }
}