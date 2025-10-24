package org.acme.suite.socialops.resources;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.*;
import org.acme.suite.socialops.domain.*;
import org.acme.suite.socialops.repo.*;

import io.quarkus.panache.common.Sort;

import java.time.*;

@Path("/api/schedule")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ScheduleResource {
    @Inject
    ScheduledPostRepo repo;

    @Inject
    AccountRepo accountRepo;

    public record CreateReq(
            String title,
            String description,
            String tags,
            String date,
            String mediaId,
            Platform platform,
            String accountId) {
    }

    @DELETE
    @Path("/{id}")
    public Map<String, Boolean> delete(@PathParam("id") String id) {
        repo.deleteById(java.util.UUID.fromString(id));
        return Map.of("ok", true);
    }

    @POST
    @Transactional
    public ScheduledPost create(CreateReq r) {
        Account acc = (r.accountId() != null && !r.accountId().isBlank())
                ? accountRepo.findById(UUID.fromString(r.accountId()))
                : accountRepo.find("platform=?1 and isDefault=true and connected=true", r.platform).firstResult();

        if (acc == null)
            throw new WebApplicationException("no connected account", 400);

        ScheduledPost p = new ScheduledPost();
        p.id = UUID.randomUUID();
        p.platform = r.platform();
        p.title = Optional.ofNullable(r.title()).orElse("Untitled");
        p.description = Optional.ofNullable(r.description()).orElse("");
        p.tags = Optional.ofNullable(r.tags()).orElse("");
        p.mediaId = UUID.fromString(r.mediaId());
        p.accountId = acc.id;

        OffsetDateTime at = r.date().length() <= 10
                ? ZonedDateTime.of(LocalDate.parse(r.date()), LocalTime.of(9, 0), ZoneId.systemDefault())
                        .toOffsetDateTime()
                : OffsetDateTime.parse(r.date() + ":00Z");

        p.date = at;
        p.status = "PENDING";
        p.created_at = OffsetDateTime.now();
        repo.persist(p);
        return p;
    }

    @GET
    public List<ScheduledPost> list() {
        return repo.listAll(Sort.by("createdAt").descending());
    }
}