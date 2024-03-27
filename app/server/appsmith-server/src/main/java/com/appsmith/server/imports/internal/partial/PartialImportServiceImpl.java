package com.appsmith.server.imports.internal.partial;

import com.appsmith.external.models.Datasource;
import com.appsmith.server.actioncollections.base.ActionCollectionService;
import com.appsmith.server.applications.base.ApplicationService;
import com.appsmith.server.domains.ActionCollection;
import com.appsmith.server.domains.CustomJSLib;
import com.appsmith.server.domains.NewAction;
import com.appsmith.server.domains.NewPage;
import com.appsmith.server.domains.Plugin;
import com.appsmith.server.imports.importable.ImportableService;
import com.appsmith.server.imports.internal.ImportService;
import com.appsmith.server.newactions.base.NewActionService;
import com.appsmith.server.newpages.base.NewPageService;
import com.appsmith.server.refactors.applications.RefactoringService;
import com.appsmith.server.repositories.cakes.PermissionGroupRepositoryCake;
import com.appsmith.server.services.AnalyticsService;
import com.appsmith.server.services.ApplicationPageService;
import com.appsmith.server.services.ApplicationTemplateService;
import com.appsmith.server.services.SessionUserService;
import com.appsmith.server.services.WorkspaceService;
import com.appsmith.server.solutions.ActionPermission;
import com.appsmith.server.solutions.ApplicationPermission;
import com.appsmith.server.solutions.DatasourcePermission;
import com.appsmith.server.solutions.PagePermission;
import com.appsmith.server.solutions.WorkspacePermission;
import com.appsmith.server.widgets.refactors.WidgetRefactorUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@Primary
public class PartialImportServiceImpl extends PartialImportServiceCEImpl implements PartialImportService {

    public PartialImportServiceImpl(
            ImportService importService,
            WorkspaceService workspaceService,
            ApplicationService applicationService,
            AnalyticsService analyticsService,
            DatasourcePermission datasourcePermission,
            WorkspacePermission workspacePermission,
            ApplicationPermission applicationPermission,
            PagePermission pagePermission,
            ActionPermission actionPermission,
            SessionUserService sessionUserService,
            PermissionGroupRepositoryCake permissionGroupRepository,
            ImportableService<Plugin> pluginImportableService,
            ImportableService<NewPage> newPageImportableService,
            ImportableService<CustomJSLib> customJSLibImportableService,
            ImportableService<Datasource> datasourceImportableService,
            ImportableService<NewAction> newActionImportableService,
            ImportableService<ActionCollection> actionCollectionImportableService,
            NewPageService newPageService,
            RefactoringService refactoringService,
            ApplicationTemplateService applicationTemplateService,
            WidgetRefactorUtil widgetRefactorUtil,
            ApplicationPageService applicationPageService,
            NewActionService newActionService,
            ActionCollectionService actionCollectionService) {
        super(
                importService,
                workspaceService,
                applicationService,
                analyticsService,
                datasourcePermission,
                workspacePermission,
                applicationPermission,
                pagePermission,
                actionPermission,
                sessionUserService,
                permissionGroupRepository,
                pluginImportableService,
                newPageImportableService,
                customJSLibImportableService,
                datasourceImportableService,
                newActionImportableService,
                actionCollectionImportableService,
                newPageService,
                refactoringService,
                applicationTemplateService,
                widgetRefactorUtil,
                applicationPageService,
                newActionService,
                actionCollectionService);
    }
}
