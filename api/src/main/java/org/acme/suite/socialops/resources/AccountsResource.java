package org.acme.suite.socialops.resources;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.inject.Inject;
import java.util.*;
import org.acme.suite.socialops.domain.*;
import org.acme.suite.socialops.dto.*;
import org.acme.suite.socialops.repo.*;

@Path("/api/accounts")
@Produces(MediaType.APPLICATION_JSON)
public class AccountsResource {
    @Inject
    AccountRepo repo;

    @GET
    public List<AccountDto> list() {
        List<Account> all = repo.listAll();
        List<AccountDto> out = new ArrayList<>();
        for (Platform p : Platform.values()) {
            Account a = all.stream().filter(x -> x.platform == p && x.connected).findFirst().orElse(null);
            out.add(new AccountDto(p, a != null ? a.name : p.name(), a != null && a.connected, null));
        }
        return out;
    }

    @GET
    @Path("/{platform}")
    public List<PlatformAccountDto> listByPlatform(@PathParam("platform") String platform) {
        Platform p;
        try {
            p = Platform.valueOf(platform.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Unknown platform: " + platform);
        }

        List<Account> rows = repo.listByPlatform(p);
        List<PlatformAccountDto> out = new ArrayList<>(rows.size());
        for (Account a : rows) {
            out.add(new PlatformAccountDto(
                    a.id,
                    a.platform,
                    a.name,
                    a.handle,
                    a.access_token,
                    a.refresh_token,
                    a.connected,
                    a.isDefault,
                    a.externalId,
                    a.avatarUrl));
        }
        return out;
    }
}
