package org.acme.suite.socialops.config;

import jakarta.annotation.Priority;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.*;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;
import java.io.IOException;

@Provider
@Priority(Priorities.HEADER_DECORATOR)
public class CorsFilter implements ContainerRequestFilter, ContainerResponseFilter {

    private static final String ALLOW_METHODS = "GET,POST,PUT,DELETE,OPTIONS";
    private static final String ALLOW_HEADERS = "origin, content-type, accept, authorization";
    private static final String ALLOW_CREDENTIALS = "true";

    @Override
    public void filter(ContainerRequestContext request) throws IOException {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            String origin = request.getHeaderString("Origin");
            if (origin != null && isAllowedOrigin(origin)) {
                Response resp = Response.noContent()
                        .header("Access-Control-Allow-Origin", origin)
                        .header("Vary", "Origin")
                        .header("Access-Control-Allow-Credentials", ALLOW_CREDENTIALS)
                        .header("Access-Control-Allow-Methods", ALLOW_METHODS)
                        .header("Access-Control-Allow-Headers", ALLOW_HEADERS)
                        .build();
                request.abortWith(resp);
            }
        }
    }

    @Override
    public void filter(ContainerRequestContext request, ContainerResponseContext response) throws IOException {
        String origin = request.getHeaderString("Origin");
        if (origin != null && isAllowedOrigin(origin)) {
            response.getHeaders().putSingle("Access-Control-Allow-Origin", origin);
            response.getHeaders().putSingle("Vary", "Origin");
            response.getHeaders().putSingle("Access-Control-Allow-Credentials", ALLOW_CREDENTIALS);
            response.getHeaders().putSingle("Access-Control-Allow-Methods", ALLOW_METHODS);
            response.getHeaders().putSingle("Access-Control-Allow-Headers", ALLOW_HEADERS);
        }
    }

    private boolean isAllowedOrigin(String origin) {
        return "http://localhost:3000".equals(origin) || "http://127.0.0.1:3000".equals(origin);
    }
}