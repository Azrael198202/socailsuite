package org.acme.suite.socialops.repo;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;

import org.acme.suite.socialops.domain.Account;
import org.acme.suite.socialops.domain.Platform;

@ApplicationScoped
public class AccountRepo implements PanacheRepository<Account> {

    public List<Account> listAllConnected() {
        return list("connected", true);
    }

    public Account findByPlatform(String platform) {
        return find("platform", platform).firstResult();
    }

    public List<Account> listByPlatform(Platform p) {
        return list("platform", p);
    }

    public void clearDefault(Platform p) {
        update("isDefault=false where platform=?1", p);
    }
}