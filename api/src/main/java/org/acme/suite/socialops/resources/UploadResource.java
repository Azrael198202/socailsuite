package org.acme.suite.socialops.resources;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.io.IOException;
import java.util.*;

import org.acme.suite.socialops.utils.MediaUpload;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;

@Path("/api/files")
@Produces(MediaType.APPLICATION_JSON)
public class UploadResource {

    @Inject 
    MediaUpload mediaUpload;

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Transactional
    public Map<String, Object> upload(
            @RestForm("file") FileUpload file) throws IOException {

        return mediaUpload.upload(file);
    }
}