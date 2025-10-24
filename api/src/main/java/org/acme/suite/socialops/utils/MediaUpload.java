package org.acme.suite.socialops.utils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

import org.acme.suite.socialops.domain.MediaFile;
import org.acme.suite.socialops.repo.MediaFileRepo;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.StreamingOutput;

@ApplicationScoped
@Transactional
public class MediaUpload {

    @Inject
    MediaFileRepo mediaFileRepo;

    static final Path ROOT = Path.of(System.getProperty("user.dir"), "uploads");
    static {
        try {
            Files.createDirectories(ROOT);
        } catch (Exception ignored) {
        }
    }

    public Map<String, Object> upload(
            @RestForm("file") FileUpload file) throws IOException {
        UUID id = UUID.randomUUID();
        String fname = file.fileName();
        String ext = fname.lastIndexOf('.') > 0 ? fname.substring(fname.lastIndexOf('.')) : "";
        Path dst = ROOT.resolve(id + ext);
        Files.copy(file.uploadedFile(), dst, StandardCopyOption.REPLACE_EXISTING);

        MediaFile mf = new MediaFile();
        mf.id = id;
        mf.filename = fname;
        mf.contentType = file.contentType();
        mf.size = Files.size(dst);
        mf.storagePath = dst.toString();
        mf.created_at = OffsetDateTime.now();
        mediaFileRepo.persist(mf);

        return Map.of("id", id.toString(), "filename", fname, "size", mf.size, "url", "/api/files/" + id.toString(),
                "path", mf.storagePath);
    }

    public Response review(
            @RestForm("id") String id) throws IOException {
        MediaFile mf = mediaFileRepo.findById(UUID.fromString(id));
        if (mf == null) {
            throw new IOException("file not found");
        }

        Path p = Path.of(mf.storagePath);
        if (!Files.exists(p)) {
            throw new NotFoundException();
        }

        String ct = Files.probeContentType(p);
        StreamingOutput stream = out -> Files.copy(p, out);

        return Response.ok(stream)
                .type(ct != null ? ct : "video/mp4")
                .header("Accept-Ranges", "bytes")
                .build();
    }
}
