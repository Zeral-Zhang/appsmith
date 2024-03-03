package com.appsmith.external.models;

import com.appsmith.external.converters.HttpMethodConverter;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.google.gson.annotations.JsonAdapter;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Transient;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.FieldNameConstants;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.annotations.Type;
import org.hibernate.validator.constraints.Range;
import org.springframework.http.HttpMethod;
import reactor.netty.http.HttpProtocol;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static com.appsmith.external.constants.ActionConstants.DEFAULT_ACTION_EXECUTION_TIMEOUT_MS;

@Getter
@Setter
@ToString
@Slf4j
@NoArgsConstructor
@Entity
@FieldNameConstants
public class ActionConfiguration implements AppsmithDomain, ExecutableConfiguration {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    private static final int MIN_TIMEOUT_VALUE = 0; // in Milliseconds
    private static final int MAX_TIMEOUT_VALUE = 60000; // in Milliseconds
    private static final String TIMEOUT_OUT_OF_RANGE_MESSAGE =
            "'Query timeout' field must be an integer between " + MIN_TIMEOUT_VALUE + " and " + MAX_TIMEOUT_VALUE;
    /*
     * Any of the fields mentioned below could be represented in mustache
     * template. If the mustache template is found, it would be replaced
     * realtime every time the action needs to be executed. If no {{}} braces
     * are found, that implies the configuration is global for this action.
     * Global signifies that the configuration remains constant for each
     * action execution.
     */

    @Range(min = MIN_TIMEOUT_VALUE, max = MAX_TIMEOUT_VALUE, message = TIMEOUT_OUT_OF_RANGE_MESSAGE)
    Integer timeoutInMillisecond;

    PaginationType paginationType = PaginationType.NONE;

    // API fields
    String path;

    @Type(JsonBinaryType.class)
    @Column(columnDefinition = "jsonb")
    List<Property> headers;

    @Type(JsonBinaryType.class)
    @Column(columnDefinition = "jsonb")
    List<Property> autoGeneratedHeaders;

    Boolean encodeParamsToggle = true;

    @Type(JsonBinaryType.class)
    @Column(columnDefinition = "jsonb")
    List<Property> queryParameters;

    String body;
    // For form-data input instead of json use the following
    @Type(JsonBinaryType.class)
    @Column(columnDefinition = "jsonb")
    List<Property> bodyFormData;
    // For route parameters extracted from rapid-api
    @Type(JsonBinaryType.class)
    @Column(columnDefinition = "jsonb")
    List<Property> routeParameters;
    // All the following adapters are registered so that we can serialize between enum HttpMethod,
    // and what is now the class HttpMethod
    @JsonSerialize(using = HttpMethodConverter.HttpMethodSerializer.class)
    @JsonDeserialize(using = HttpMethodConverter.HttpMethodDeserializer.class)
    @JsonAdapter(HttpMethodConverter.class)
    HttpMethod httpMethod;

    HttpProtocol httpVersion;
    // Paginated API fields
    String next;
    String prev;

    /**
     * This field is supposed to hold a set of paths that are expected to contain bindings that refer to the same action
     * object i.e. a cyclic reference. e.g. A GraphQL API response can contain pagination cursors that are required
     * to be configured in the pagination tab of the same API. We don't want to treat these cyclic references as
     * cyclic dependency errors.
     */
    @Transient
    Set<String> selfReferencingDataPaths = new HashSet<>();

    // DB action fields

    // JS action fields
    // Body, the raw class data, is shared with API type actions
    // Represents the values that need to be
    @Type(JsonBinaryType.class)
    @Column(columnDefinition = "jsonb")
    List<JSValue> jsArguments;
    // This property is being retained right now so that Git does not see commit changes, do not use
    @Deprecated(forRemoval = true)
    Boolean isAsync;

    Boolean isValid;

    /*
     * Future plugins could require more fields that are not covered above.
     * They will have to represented in a key-value format where the plugin
     * understands what the keys stand for.
     */
    @Type(JsonBinaryType.class)
    @Column(columnDefinition = "jsonb")
    List<Property> pluginSpecifiedTemplates;

    /*
     * After porting plugins to UQI, we should be able to use a map for referring to form data
     * instead of a list of properties
     */
    @Type(JsonBinaryType.class)
    @Column(columnDefinition = "jsonb")
    Map<String, Object> formData;

    @Transient
    String templateName;

    public void setTimeoutInMillisecond(String timeoutInMillisecond) {
        try {
            this.timeoutInMillisecond = Integer.valueOf(timeoutInMillisecond);
        } catch (NumberFormatException e) {
            log.debug("Failed to convert timeout request parameter to Integer. Setting it to max valid value.");
            this.timeoutInMillisecond = MAX_TIMEOUT_VALUE;
        }
    }

    @Transient
    public Integer getTimeoutInMillisecond() {
        return (timeoutInMillisecond == null || timeoutInMillisecond <= 0)
                ? DEFAULT_ACTION_EXECUTION_TIMEOUT_MS
                : timeoutInMillisecond;
    }
}
