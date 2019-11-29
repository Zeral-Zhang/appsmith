package com.appsmith.server.domains;

import com.appsmith.server.dtos.DslActionDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import net.minidev.json.JSONObject;

import java.util.Set;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class Layout extends BaseDomain {

    ScreenType screen;

    @JsonIgnore
    Boolean viewMode = false;

    JSONObject dsl;

    @JsonIgnore
    JSONObject publishedDsl;

    Set<DslActionDTO> dslActions;

    @JsonIgnore
    Set<DslActionDTO> publishedDslActions;

    /**
     * If view mode, the dsl returned should be the publishedDSL, else if the edit mode is on (view mode = false)
     * the dsl returned should be JSONObject dsl
     */
    public JSONObject getDsl() {
        return viewMode ? publishedDsl : dsl;
    }

    public Set<DslActionDTO> getDslActions() {
        return viewMode ? publishedDslActions : dslActions;
    }
}
