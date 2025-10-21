package org.acme.suite.socialops.jobs;

import io.quarkus.scheduler.Scheduled;
import jakarta.enterprise.context.ApplicationScoped;
import org.jboss.logging.Logger;

@ApplicationScoped
public class MetricsRollupJob {
    private static final Logger LOG = Logger.getLogger(MetricsRollupJob.class);

    @Scheduled(cron = "0 0 * * * ?") // 每小时执行一次
    void rollup() {
        LOG.info("Rolling up metrics for dashboard...");
        // TODO: 聚合统计 KPI
    }
}