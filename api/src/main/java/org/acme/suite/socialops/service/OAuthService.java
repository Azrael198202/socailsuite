package org.acme.suite.socialops.service;

import jakarta.enterprise.context.ApplicationScoped;
import org.acme.suite.socialops.domain.*;
import org.acme.suite.socialops.repo.*;
import jakarta.inject.Inject;
import java.util.*;

@ApplicationScoped
public class OAuthService {
    @Inject
    AccountRepo accounts;

    public String buildAuthorizeUrl(Platform p) {
        // TODO: 拼接各平台 OAuth URL（带 state）
        return "https://auth.example/" + p + "?client_id=...&redirect_uri=...&state=...";
    }

    public void saveTokens(Platform p, String name, String access, String refresh) {
        Account a = new Account();
        a.id = UUID.randomUUID();
        a.platform = p;
        a.name = name;
        a.access_token = access;
        a.refresh_token = refresh;
        a.connected = true;
        accounts.persist(a);
    }

    public void revoke(Platform p) {
        accounts.find("platform", p).stream().forEach(acc -> {
            acc.connected = false;
            acc.access_token = null;
            acc.refresh_token = null;
        });
    }
}