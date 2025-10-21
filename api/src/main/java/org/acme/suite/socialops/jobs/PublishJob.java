package org.acme.suite.socialops.jobs;

import io.quarkus.scheduler.Scheduled;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.jboss.logging.Logger;
import org.acme.suite.socialops.service.*;
import org.acme.suite.socialops.domain.*;

@ApplicationScoped
public class PublishJob {
    private static final Logger LOG = Logger.getLogger(PublishJob.class);
    @Inject
    PublishService service;

    @Scheduled(every = "60s") // 每分钟检查一次
    void tick() {
        for (ScheduledPost p : service.dueToday()) {
            try {
                // TODO: 调用具体平台 SDK/API 上传或发布
                LOG.infof("Publishing %s to %s", p.title, p.platform);
                service.markPublished(p);
            } catch (Exception e) {
                LOG.error("publish failed", e);
            }
        }
    }
}