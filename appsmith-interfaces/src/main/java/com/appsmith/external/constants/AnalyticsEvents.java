package com.appsmith.external.constants;

import java.util.Locale;

public enum AnalyticsEvents {
    CREATE,
    UPDATE,
    DELETE,
    ARCHIVE,
    VIEW,
    APPLY,
    IMPORT,
    EXPORT,
    CLONE,
    LOGIN,
    LOGOUT,
    FIRST_LOGIN,
    EXECUTE_ACTION("execute_ACTION_TRIGGERED"),
    EXECUTE_INVITE_USERS("execute_INVITE_USERS"),
    UPDATE_LAYOUT,
    PUBLISH_APPLICATION("publish_APPLICATION"),
    FORK,
    PAGE_REORDER,
    GENERATE_CRUD_PAGE("generate_CRUD_PAGE"),
    CREATE_SUPERUSER,
    SUBSCRIBE_MARKETING_EMAILS,
    UNSUBSCRIBE_MARKETING_EMAILS,
    INSTALLATION_SETUP_COMPLETE("Installation Setup Complete"),
    GIT_CONNECT,
    GIT_PRIVATE_REPO_LIMIT_EXCEEDED,
    GIT_CREATE_BRANCH,
    GIT_COMMIT,
    GIT_PUSH,
    GIT_MERGE,
    GIT_PULL,
    GIT_PRUNE,
    GIT_DISCONNECT,
    GIT_CHECKOUT_BRANCH,
    GIT_CHECKOUT_REMOTE_BRANCH,
    GIT_IMPORT,
    GIT_TEST_CONNECTION,
    GIT_DELETE_BRANCH,
    GIT_DISCARD_CHANGES,
    GIT_RESET_HARD,
    GIT_LIST_BRANCH,
    GIT_RESET,
    GIT_STATUS,
    GIT_STATUS_WITHOUT_FETCH,
    GIT_COMMIT_HISTORY,
    GIT_CLONE,
    GIT_CHECKOUT,
    GIT_SYNC_BRANCH,
    GIT_LIST_LOCAL_BRANCH,
    GIT_MERGE_CHECK,
    GIT_FETCH,
    AUTHENTICATION_METHOD_CONFIGURATION("Authentication Method Configured"),
    INSTANCE_SETTING_UPDATED,
    GENERATE_SSH_KEY("generate_SSH_KEY"),
    UNIT_EXECUTION_TIME,

    // Events to log execution time
    GIT_SERIALIZE_APP_RESOURCES_TO_LOCAL_FILE,
    GIT_DESERIALIZE_APP_RESOURCES_FROM_FILE,

    // Entity refactor related events
    REFACTOR_JSOBJECT,
    REFACTOR_ACTION,
    REFACTOR_JSACTION,
    REFACTOR_WIDGET,

    INVITE_USERS_TO_USER_GROUPS,
    REMOVE_USERS_FROM_USER_GROUPS,
    ASSIGNED_TO_PERMISSION_GROUP,
    UNASSIGNED_FROM_PERMISSION_GROUP,
    ASSIGNED_USERS_TO_PERMISSION_GROUP,
    UNASSIGNED_USERS_FROM_PERMISSION_GROUP,
    ASSIGNED_USER_GROUPS_TO_PERMISSION_GROUP,
    UNASSIGNED_USER_GROUPS_FROM_PERMISSION_GROUP,
    ACTIVATE_NEW_INSTANCE("Activate_New_Instance"),
    UPDATE_EXISTING_LICENSE("Update_Existing_License"),

    DS_SCHEMA_FETCH_EVENT("Datasource_Schema_Fetch"),

    DS_TEST_EVENT("Test_Datasource_Clicked"),
    DS_TEST_EVENT_SUCCESS("Test_Datasource_Success"),
    DS_TEST_EVENT_FAILED("Test_Datasource_Failed"),

    GIT_STALE_FILE_LOCK_DELETED,
    SERVER_SETUP_COMPLETE("server_setup_complete");

    private final String eventName;

    AnalyticsEvents() {
        this.eventName = name().toLowerCase(Locale.ROOT);
    }

    AnalyticsEvents(String eventName) {
        this.eventName = eventName;
    }

    public String getEventName() {
        return eventName;
    }
}
