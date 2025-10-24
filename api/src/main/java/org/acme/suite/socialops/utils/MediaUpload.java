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

import jakarta.inject.Inject;

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
        mf.createdAt = OffsetDateTime.now();
        mediaFileRepo.persist(mf);

        return Map.of("id", id.toString(), "filename", fname, "size", mf.size);
    }
}
