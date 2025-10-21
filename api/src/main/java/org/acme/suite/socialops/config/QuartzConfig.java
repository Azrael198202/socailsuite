package org.acme.suite.socialops.config;

import io.quarkus.scheduler.Scheduled;
import jakarta.enterprise.context.ApplicationScoped;
import org.jboss.logging.Logger;

@ApplicationScoped
public class QuartzConfig {
    private static final Logger LOG = Logger.getLogger(QuartzConfig.class);

    @Scheduled(every = "60s")
    void heartbeat() {
        LOG.info("Quartz heartbeat OK");
    }
}