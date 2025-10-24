package org.acme.suite.socialops.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import org.acme.suite.socialops.domain.*;
import org.acme.suite.socialops.repo.*;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.json.JSONObject;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.net.URLEncoder;
import java.util.Arrays;
import java.util.Optional;

@ApplicationScoped
public class YouTubePublisherService {

  @Inject MediaFileRepo mediaRepo;
  @Inject AccountRepo accountRepo;

  @ConfigProperty(name="oauth.youtube.client-id")     String clientId;
  @ConfigProperty(name="oauth.youtube.client-secret") String clientSecret;

  private String refreshAccessToken(String refreshToken) throws Exception {
    var form = "client_id="+enc(clientId)+
               "&client_secret="+enc(clientSecret)+
               "&refresh_token="+enc(refreshToken)+
               "&grant_type=refresh_token";

    HttpClient http = HttpClient.newHttpClient();
    var resp = http.send(
      HttpRequest.newBuilder(URI.create("https://oauth2.googleapis.com/token"))
         .header("Content-Type","application/x-www-form-urlencoded")
         .POST(HttpRequest.BodyPublishers.ofString(form))
         .build(),
      HttpResponse.BodyHandlers.ofString());

    if (resp.statusCode()/100 != 2)
      throw new RuntimeException("refresh token failed: "+resp.body());

    return new JSONObject(resp.body()).getString("access_token");
  }

  @Transactional
  public void publish(ScheduledPost job) throws Exception {
    MediaFile mf = mediaRepo.findById(job.mediaId);
    Account acc = accountRepo.findById(job.accountId);
    if (mf==null || acc==null) throw new RuntimeException("media/account missing");
    if (acc.refresh_token==null || acc.refresh_token.isBlank())
      throw new RuntimeException("no refresh_token for account");

    String accessToken = refreshAccessToken(acc.refresh_token);

    var snippet = new JSONObject()
      .put("title", job.title)
      .put("description", job.description)
      .put("tags", Arrays.stream(Optional.ofNullable(job.tags).orElse("")
                    .split(",")).map(String::trim).filter(s->!s.isEmpty()).toArray(String[]::new));

    var status = new JSONObject()
      .put("privacyStatus", "private")
      .put("publishAt", job.date.toInstant().toString());

    var body = new JSONObject().put("snippet", snippet).put("status", status).toString();

    HttpClient http = HttpClient.newHttpClient();
    var init = http.send(
      HttpRequest.newBuilder(URI.create("https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status"))
        .header("Authorization", "Bearer "+accessToken)
        .header("Content-Type","application/json; charset=UTF-8")
        .header("X-Upload-Content-Type", mf.contentType!=null?mf.contentType:"video/*")
        .POST(HttpRequest.BodyPublishers.ofString(body))
        .build(),
      HttpResponse.BodyHandlers.discarding());

    if (init.statusCode()/100 != 2)
      throw new RuntimeException("create session failed: "+init.statusCode());

    String uploadUrl = init.headers().firstValue("Location")
        .orElseThrow(()->new RuntimeException("no Location header"));

    var filePath = Path.of(mf.storagePath);
    long size = Files.size(filePath);

    var put = http.send(
      HttpRequest.newBuilder(URI.create(uploadUrl))
        .header("Authorization", "Bearer "+accessToken)
        .header("Content-Length", String.valueOf(size))
        .header("Content-Type", mf.contentType!=null?mf.contentType:"video/*")
        .PUT(HttpRequest.BodyPublishers.ofFile(filePath))
        .build(),
      HttpResponse.BodyHandlers.ofString());

    if (put.statusCode()/100 != 2)
      throw new RuntimeException("upload failed: "+put.statusCode()+" "+put.body());

    job.status = "SUCCESS";
    job.lastError = null;
  }

  private static String enc(String s){
    return URLEncoder.encode(s, java.nio.charset.StandardCharsets.UTF_8);
  }
}
