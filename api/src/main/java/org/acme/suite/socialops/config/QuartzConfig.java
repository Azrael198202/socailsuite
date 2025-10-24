package org.acme.suite.socialops.config;

import io.quarkus.scheduler.Scheduled;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;

import java.time.OffsetDateTime;
import java.util.List;

import org.acme.suite.socialops.repo.ScheduledPostRepo;
import org.acme.suite.socialops.domain.ScheduledPost;
import org.acme.suite.socialops.domain.Platform;
import org.acme.suite.socialops.service.YouTubePublisherService;

@Singleton
public class QuartzConfig {

  @Inject 
  ScheduledPostRepo postRepo;
  
  @Inject 
  YouTubePublisherService ytService;

  @Scheduled(every="30s")
  void tick(){
    OffsetDateTime now = OffsetDateTime.now().minusMinutes(1);
    List<ScheduledPost> due = postRepo.list("status=?1 and date<=?2", "PENDING", now);
    for (var job : due){
      try {
        job.status = "RUNNING";
        postRepo.persist(job);
        if (job.platform == Platform.youtube) {
          ytService.publish(job);
        } else {
          job.status = "FAILED";
          job.lastError = "Unsupported platform: "+job.platform;
        }
      } catch (Exception e){
        job.status = "FAILED";
        job.lastError = e.getMessage();
      } finally {
        job.updated_at = OffsetDateTime.now();
        postRepo.persist(job);
      }
    }
  }
}
