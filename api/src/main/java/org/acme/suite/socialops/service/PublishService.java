package org.acme.suite.socialops.service;

import jakarta.enterprise.context.ApplicationScoped;
import org.acme.suite.socialops.domain.*;
import org.acme.suite.socialops.repo.*;
import jakarta.inject.Inject;
import java.util.*;

@ApplicationScoped
public class PublishService {
    @Inject
    ScheduledPostRepo posts;

    public List<ScheduledPost> dueToday() {
        return posts.list("date = ?1 and status = 'PENDING'", java.time.LocalDate.now());
    }

    public void markPublished(ScheduledPost p) {
        p.status = "PUBLISHED";
        posts.persist(p);
    }
}