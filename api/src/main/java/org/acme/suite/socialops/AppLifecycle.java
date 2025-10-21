package org.acme.suite.socialops;

import io.quarkus.runtime.StartupEvent;
import io.quarkus.runtime.ShutdownEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import org.jboss.logging.Logger;

@ApplicationScoped
public class AppLifecycle {
    private static final Logger LOG = Logger.getLogger(AppLifecycle.class);

    void onStart(@Observes StartupEvent ev) {
        LOG.info("🚀 SocialOps API started");
    }

    void onStop(@Observes ShutdownEvent ev) {
        LOG.info("🛑 SocialOps API stopped");
    }
}