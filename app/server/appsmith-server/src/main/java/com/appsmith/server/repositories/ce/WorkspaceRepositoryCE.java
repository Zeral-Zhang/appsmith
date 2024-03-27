package com.appsmith.server.repositories.ce;

import com.appsmith.server.domains.Workspace;
import com.appsmith.server.repositories.BaseRepository;
import com.appsmith.server.repositories.CustomWorkspaceRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface WorkspaceRepositoryCE extends BaseRepository<Workspace, String>, CustomWorkspaceRepository {

    Optional<Workspace> findByIdAndPluginsPluginId(String workspaceId, String pluginId);

    Optional<Workspace> findByName(String name);

    Optional<Long> countByDeletedAtNull();
}
