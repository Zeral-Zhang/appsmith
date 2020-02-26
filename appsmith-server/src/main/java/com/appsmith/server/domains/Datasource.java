package com.appsmith.server.domains;

import com.appsmith.external.models.BaseDomain;
import com.appsmith.external.models.DatasourceConfiguration;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Set;

@Getter
@Setter
@ToString
@NoArgsConstructor
@Document
@CompoundIndex(def = "{'organizationId':1, 'name':1}", name = "organization_datasource_compound_index", unique = true)
public class Datasource extends BaseDomain {
    String name;

    String pluginId;

    String organizationId;

    DatasourceConfiguration datasourceConfiguration;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    Boolean isValid;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    Set<String> invalids;

    /*
     * This field is used to determine if the Datasource has been generated by the client or auto-generated by the system.
     * We use this field because when embedded datasources are null, spring-data auditable interfaces throw exceptions
     * while trying set createdAt and updatedAt properties on the null object
     */
    @Transient
    @JsonIgnore
    Boolean isAutoGenerated = false;
}
