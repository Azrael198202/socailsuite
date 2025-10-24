package org.acme.suite.socialops.resources;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.*;
import java.util.stream.Collectors;

import org.acme.suite.socialops.domain.*;
import org.acme.suite.socialops.dto.ScheduledPostDto;
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
                : accountRepo.find("platform=?1 and connected=true", r.platform).firstResult();

        if (acc == null)
            throw new WebApplicationException("no connected account", 400);

        List<Account> accounts = accountRepo.list("platform=?1 and connected=true", r.platform);

        for (Account account : accounts) {
            ScheduledPost p = new ScheduledPost();
            p.id = UUID.randomUUID();
            p.platform = r.platform();
            p.title = Optional.ofNullable(r.title()).orElse("Untitled");
            p.description = Optional.ofNullable(r.description()).orElse("");
            p.tags = Optional.ofNullable(r.tags()).orElse("");
            p.mediaId = UUID.fromString(r.mediaId());
            p.accountId = account.id;

            OffsetDateTime at = r.date().length() <= 10
                    ? ZonedDateTime.of(LocalDate.parse(r.date()), LocalTime.of(9, 0), ZoneId.systemDefault())
                            .toOffsetDateTime()
                    : OffsetDateTime.parse(r.date() + ":00Z");

            p.date = at;
            p.status = "PENDING";
            p.created_at = OffsetDateTime.now();
            repo.persist(p);
        }

        return repo
                .find("accountId=?1 and date=?2", acc.id, ZonedDateTime
                        .of(LocalDate.parse(r.date()), LocalTime.of(9, 0), ZoneId.systemDefault()).toOffsetDateTime())
                .firstResult();
    }

    @GET
    public List<ScheduledPost> list() {
        return repo.listAll(Sort.by("created_at").descending());
    }

    @GET
    @Path("/range")
    public List<ScheduledPostDto> listRange(@QueryParam("from") String from,
            @QueryParam("to") String to) {
        if (from == null || to == null) {
            throw new BadRequestException("from & to must be provided as YYYY-MM-DD");
        }
        LocalDate f = LocalDate.parse(from);
        LocalDate t = LocalDate.parse(to);
        ZoneId z = zone();

        return repo.listRange(f, t, z).stream()
                .map(s -> toDto(s, z))
                .collect(Collectors.toList());
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public ScheduledPostDto update(@PathParam("id") String id, CreateReq r) {
        ScheduledPost s = repo.findByIdOptional(UUID.fromString(id))
                .orElseThrow(NotFoundException::new);

        if (r.title() != null)
            s.title = r.title();
        if (r.description() != null)
            s.description = r.description();
        if (r.tags() != null)
            s.tags = r.tags();
        if (r.platform() != null)
            s.platform = r.platform();
        if (r.date() != null) {
            OffsetDateTime at = r.date().length() <= 10
                    ? ZonedDateTime.of(LocalDate.parse(r.date()), LocalTime.of(9, 0), ZoneId.systemDefault())
                            .toOffsetDateTime()
                    : OffsetDateTime.parse(r.date() + ":00Z");
            s.date = at;
        }
        if (r.mediaId() != null)
            s.mediaId = UUID.fromString(r.mediaId());

        repo.persist(s);
        return toDto(s, zone());
    }

    private static ScheduledPostDto toDto(ScheduledPost s, ZoneId zone) {
        return new ScheduledPostDto(
                s.id.toString(),
                s.title,
                s.platform,
                s.date,
                s.description,
                PublishStatus.valueOf(s.status),
                s.tags);
    }

    private static ZoneId zone() {
        return ZoneId.systemDefault();
    }
}