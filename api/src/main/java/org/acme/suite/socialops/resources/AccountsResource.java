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
}
