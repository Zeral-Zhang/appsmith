package com.appsmith.server.acl;

import com.appsmith.server.domains.Action;
import com.appsmith.server.domains.Application;
import com.appsmith.server.domains.Organization;
import com.appsmith.server.domains.Page;
import lombok.Getter;

@Getter
public enum AclPermission {

    // These are generic permissions created to make the transition to the new ACL format easy. They must be removed
    CREATE("create", null),
    READ("read", null),
    UPDATE("update", null),
    DELETE("delete", null),

    MANAGE_ORGANIZATIONS("manage:organizations", Organization.class),
    READ_ORGANIZATIONS("read:organizations", Organization.class),
    ORGANIZATION_MANAGE_APPLICATIONS("manage:orgApplications", Organization.class),
    ORGANIZATION_READ_APPLICATIONS("read:orgApplications", Organization.class),
    ORGANIZATION_PUBLISH_APPLICATIONS("publish:orgApplications", Organization.class),

    MANAGE_APPLICATIONS("manage:applications", Application.class),
    READ_APPLICATIONS("read:applications", Application.class),
    PUBLISH_APPLICATIONS("publish:applications", Application.class),

    MANAGE_PAGES("manage:pages", Page.class),
    READ_PAGES("read:pages", Page.class),

    MANAGE_ACTIONS("manage:actions", Action.class),
    READ_ACTIONS("read:actions", Action.class),
    EXECUTE_ACTIONS("execute:actions", Action.class);

    private String value;
    private Class entity;

    AclPermission(String value, Class entity) {
        this.value = value;
        this.entity = entity;
    }

    public static final AclPermission getPermissionByValue(String value, Class entity) {
        for (AclPermission permission : values()) {
            if (permission.getValue().equals(value) && permission.getEntity().equals(entity)) {
                return permission;
            }
        }
        return null;
    }
}
