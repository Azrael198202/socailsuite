package org.acme.suite.socialops.resources;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.inject.Inject;
import java.util.*;
import org.acme.suite.socialops.domain.*;
import org.acme.suite.socialops.dto.*;
import org.acme.suite.socialops.repo.*;
import java.time.*;

@Path("/api/schedule")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ScheduleResource {
    @Inject
    ScheduledPostRepo repo;

    @GET
    public List<ScheduledPostDto> list() {
        List<ScheduledPostDto> out = new ArrayList<>();
        for (ScheduledPost p : repo.listAll())
            out.add(new ScheduledPostDto(p.id.toString(), p.title, p.platform, p.date, p.description, p.tags));
        return out;
    }

    public record CreateReq(String title, Platform platform, LocalDate date, String description, String tags) {
    }

    @POST
    public ScheduledPostDto create(CreateReq r) {
        ScheduledPost p = new ScheduledPost();
        p.id = java.util.UUID.randomUUID();
        p.title = r.title;
        p.platform = r.platform;
        p.date = r.date;
        p.description = r.description;
        p.tags = r.tags;
        p.status = "PENDING";
        p.created_at = OffsetDateTime.now();
        p.updated_at = p.created_at;
        repo.persist(p);
        return new ScheduledPostDto(p.id.toString(), p.title, p.platform, p.date, p.description, p.tags);
    }

    @DELETE
    @Path("/{id}")
    public Map<String, Boolean> delete(@PathParam("id") String id) {
        repo.deleteById(java.util.UUID.fromString(id));
        return Map.of("ok", true);
    }
}