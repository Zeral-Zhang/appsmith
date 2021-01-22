package com.appsmith.server.solutions;

import com.appsmith.server.configurations.SegmentConfig;
import com.appsmith.server.services.ConfigService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.net.URI;
import java.util.Map;

/**
 * This class represents a scheduled task that pings a data point indicating that this server installation is live.
 * This ping is only invoked if the Appsmith server is NOT running in Appsmith Clouud & the user has given Appsmith
 * permissions to collect anonymized data
 */
@Component
@ConditionalOnExpression("!${is.cloud-hosted:false} && !${disable.telemetry:true}")
@Slf4j
@RequiredArgsConstructor
public class PingScheduledTask {

    private final ConfigService configService;

    private final SegmentConfig segmentConfig;

    public static final URI GET_IP_URI = URI.create("https://api64.ipify.org");

    /**
     * Gets the external IP address of this server and pings a data point to indicate that this server instance is live.
     * We use an initial delay of two minutes to roughly wait for the application along with the migrations are finished
     * and ready.
     */
    // Number of milliseconds between the start of each scheduled calls to this method.
    @Scheduled(initialDelay = 2 * 60 * 1000 /* two minutes */, fixedRate = 6 * 60 * 60 * 1000 /* six hours */)
    public void pingSchedule() {
        Mono.zip(configService.getInstanceId(), getAddress())
                .flatMap(tuple -> doPing(tuple.getT1(), tuple.getT2()))
                .subscribeOn(Schedulers.single())
                .subscribe();
    }

    /**
     * This method hits an API endpoint that returns the external IP address of this server instance.
     *
     * @return A publisher that yields the IP address.
     */
    private Mono<String> getAddress() {
        return WebClient
                .create()
                .get()
                .uri(GET_IP_URI)
                .retrieve()
                .bodyToMono(String.class);
    }

    /**
     * Given a unique ID (called a `userId` here), this method hits the Segment API to save a data point on this server
     * instance being live.
     *
     * @param instanceId A unique identifier for this server instance, usually generated at the server's first start.
     * @param ipAddress  The external IP address of this instance's machine.
     * @return A publisher that yields the string response of recording the data point.
     */
    private Mono<String> doPing(String instanceId, String ipAddress) {
        // Note: Hard-coding Segment auth header and the event name intentionally. These are not intended to be
        // environment specific values, instead, they are common values for all self-hosted environments. As such, they
        // are not intended to be configurable.
        final String ceKey = segmentConfig.getCeKey();
        if (StringUtils.isEmpty(ceKey)) {
            log.error("The segment key is null");
        }

        return WebClient
                .create("https://api.segment.io")
                .post()
                .uri("/v1/track")
                .headers(headers -> headers.setBasicAuth(ceKey, ""))
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(Map.of(
                        "userId", ipAddress,
                        "context", Map.of("ip", ipAddress),
                        "properties", Map.of("instanceId", instanceId),
                        "event", "Instance Active"
                )))
                .retrieve()
                .bodyToMono(String.class);
    }

}
