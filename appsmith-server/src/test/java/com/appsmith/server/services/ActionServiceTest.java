package com.appsmith.server.services;

import com.appsmith.external.models.ActionConfiguration;
import com.appsmith.external.models.Policy;
import com.appsmith.server.constants.FieldName;
import com.appsmith.server.domains.Action;
import com.appsmith.server.domains.Application;
import com.appsmith.server.domains.Page;
import com.appsmith.server.exceptions.AppsmithError;
import com.appsmith.server.exceptions.AppsmithException;
import lombok.extern.slf4j.Slf4j;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpMethod;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit4.SpringRunner;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.util.Map;
import java.util.Set;

import static com.appsmith.server.acl.AclPermission.MANAGE_ACTIONS;
import static com.appsmith.server.acl.AclPermission.READ_ACTIONS;
import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
@Slf4j
@DirtiesContext
public class ActionServiceTest {
    @Autowired
    ActionService actionService;

    @Autowired
    ApplicationPageService applicationPageService;

    @Autowired
    PageService pageService;

    Application testApp = null;

    Page testPage = null;

    int i = 0;

    @Before
    @WithUserDetails(value = "api_user")
    public void setup() {
        if (testApp == null && testPage == null) {
            //Create application and page which will be used by the tests to create actions for.
            Application application = new Application();
            application.setName("ActionServiceTest-App-" + String.valueOf(i));
            i++;
            testApp = applicationPageService.createApplication(application).block();
            testPage = pageService.getById(testApp.getPages().get(0).getId()).block();
        }
    }

    @After
    @WithUserDetails(value = "api_user")
    public void cleanup() {
        applicationPageService.deleteApplication(testApp.getId()).block();
        testApp = null;
        testPage = null;

    }

    @Test
    @WithUserDetails(value = "api_user")
    public void createValidActionAndCheckPermissions() {
        Policy manageActionPolicy = Policy.builder().permission(MANAGE_ACTIONS.getValue())
                .users(Set.of("api_user"))
                .build();
        Policy readActionPolicy = Policy.builder().permission(READ_ACTIONS.getValue())
                .users(Set.of("api_user"))
                .build();

        Action action = new Action();
        action.setName("validAction");
        action.setPageId(testPage.getId());
        ActionConfiguration actionConfiguration = new ActionConfiguration();
        actionConfiguration.setHttpMethod(HttpMethod.GET);
        action.setActionConfiguration(actionConfiguration);

        Mono<Action> actionMono = actionService.create(action);

        StepVerifier
                .create(actionMono)
                .assertNext(createdAction -> {
                    assertThat(createdAction.getId()).isNotEmpty();
                    assertThat(createdAction.getName()).isEqualTo(action.getName());
                    assertThat(createdAction.getPolicies()).containsAll(Set.of(manageActionPolicy, readActionPolicy));
                })
                .verifyComplete();
    }


        @Test
    @WithUserDetails(value = "api_user")
    public void createValidActionWithJustName() {
        Action action = new Action();
        action.setName("randomActionName");
        action.setPageId(testPage.getId());
        ActionConfiguration actionConfiguration = new ActionConfiguration();
        actionConfiguration.setHttpMethod(HttpMethod.GET);
        action.setActionConfiguration(actionConfiguration);
        Mono<Action> actionMono = Mono.just(action)
                .flatMap(actionService::create);
        StepVerifier
                .create(actionMono)
                .assertNext(createdAction -> {
                    assertThat(createdAction.getId()).isNotEmpty();
                    assertThat(createdAction.getName()).isEqualTo(action.getName());
                    assertThat(createdAction.getIsValid()).isFalse();
                    assertThat(createdAction.getInvalids().size()).isEqualTo(1);
                })
                .verifyComplete();
    }

    @Test
    @WithUserDetails(value = "api_user")
    public void createValidActionNullActionConfiguration() {
        Action action = new Action();
        action.setName("randomActionName2");
        action.setPageId(testPage.getId());
        Mono<Action> actionMono = Mono.just(action)
                .flatMap(actionService::create);
        StepVerifier
                .create(actionMono)
                .assertNext(createdAction -> {
                    assertThat(createdAction.getId()).isNotEmpty();
                    assertThat(createdAction.getName()).isEqualTo(action.getName());
                    assertThat(createdAction.getIsValid()).isFalse();
                    assertThat(createdAction.getInvalids()).contains(AppsmithError.NO_CONFIGURATION_FOUND_IN_ACTION.getMessage());
                })
                .verifyComplete();
    }

    @Test
    @WithUserDetails(value = "api_user")
    public void invalidCreateActionNullName() {
        Action action = new Action();
        action.setPageId(testPage.getId());
        ActionConfiguration actionConfiguration = new ActionConfiguration();
        actionConfiguration.setHttpMethod(HttpMethod.GET);
        action.setActionConfiguration(actionConfiguration);
        Mono<Action> actionMono = Mono.just(action)
                .flatMap(actionService::create);
        StepVerifier
                .create(actionMono)
                .expectErrorMatches(throwable -> throwable instanceof AppsmithException &&
                        throwable.getMessage().equals(AppsmithError.INVALID_PARAMETER.getMessage(FieldName.NAME)))
                .verify();
    }

    @Test
    @WithUserDetails(value = "api_user")
    public void invalidCreateActionNullPageId() {
        Action action = new Action();
        action.setName("randomActionName");
        ActionConfiguration actionConfiguration = new ActionConfiguration();
        actionConfiguration.setHttpMethod(HttpMethod.GET);
        action.setActionConfiguration(actionConfiguration);
        Mono<Action> actionMono = Mono.just(action)
                .flatMap(actionService::create);
        StepVerifier
                .create(actionMono)
                .expectErrorMatches(throwable -> throwable instanceof AppsmithException &&
                        throwable.getMessage().equals(AppsmithError.INVALID_PARAMETER.getMessage(FieldName.PAGE_ID)))
                .verify();
    }

    @Test
    @WithUserDetails(value = "api_user")
    public void testVariableSubstitution() {
        String json = "{\n" +
                "  \n" +
                "  \"deleted\": false,\n" +
                "  \"config\": {\n" +
                "    \"CONTAINER_WIDGET\": [\n" +
                "      {\n" +
                "        \"_id\": \"7\",\n" +
                "        \"sectionName\": \"General\",\n" +
                "        \"children\": [\n" +
                "          {\n" +
                "            \"_id\": \"7.1\",\n" +
                "            \"helpText\": \"Use a html color name, HEX, RGB or RGBA value\",\n" +
                "            \"placeholderText\": \"#FFFFFF / Gray / rgb(255, 99, 71)\",\n" +
                "            \"propertyName\": \"backgroundColor\",\n" +
                "            \"label\": \"Background Color\",\n" +
                "            \"controlType\": \"INPUT_TEXT\"\n" +
                "          },\n" +
                "          {\n" +
                "            \"_id\": \"7.2\",\n" +
                "            \"helpText\": \"Controls the visibility of the widget\",\n" +
                "            \"propertyName\": \"isVisible\",\n" +
                "            \"label\": \"Visible\",\n" +
                "            \"controlType\": \"SWITCH\",\n" +
                "            \"isJSConvertible\": true\n" +
                "          }\n" +
                "        ]\n" +
                "      }\n" +
                "    ]\n" +
                "  },\n" +
                "  \"name\": \"propertyPane\"\n" +
                "}";

        Object obj = actionService.variableSubstitution("{{Input.text}}", Map.of("Input.text", json));
        assertThat(obj).isNotNull();
        assertThat(obj).isInstanceOf(String.class);
    }

    @Test
    @WithUserDetails(value = "api_user")
    public void testVariableSubstitutionWithNewline() {
        String inputText = "name\\nvalue";
        String expectedOutput = "name\nvalue";
        Object obj = actionService.variableSubstitution("{{Input.text}}", Map.of("Input.text", inputText));
        assertThat(obj).isNotNull();
        assertThat(obj).isInstanceOf(String.class);
        assertThat(obj).isEqualTo(expectedOutput);
    }
}
