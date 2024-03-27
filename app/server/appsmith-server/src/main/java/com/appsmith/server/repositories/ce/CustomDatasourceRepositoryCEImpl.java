package com.appsmith.server.repositories.ce;

import com.appsmith.external.models.Datasource;
import com.appsmith.server.acl.AclPermission;
import com.appsmith.server.helpers.ce.bridge.Bridge;
import com.appsmith.server.repositories.BaseAppsmithRepositoryImpl;
import com.appsmith.server.repositories.CacheableRepositoryHelper;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.ReactiveMongoOperations;
import org.springframework.data.mongodb.core.convert.MongoConverter;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public class CustomDatasourceRepositoryCEImpl extends BaseAppsmithRepositoryImpl<Datasource>
        implements CustomDatasourceRepositoryCE {

    public CustomDatasourceRepositoryCEImpl(CacheableRepositoryHelper cacheableRepositoryHelper) {
        super(cacheableRepositoryHelper);
    }

    @Override
    public List<Datasource> findAllByWorkspaceId(String workspaceId, AclPermission permission) {
        Sort sort = Sort.by(Datasource.Fields.name);
        return queryBuilder()
                .criteria(Bridge.equal(Datasource.Fields.workspaceId, workspaceId))
                .permission(permission)
                .sort(sort)
                .all();
    }

    @Override
    public Optional<Datasource> findByNameAndWorkspaceId(String name, String workspaceId, AclPermission aclPermission) {
        return queryBuilder()
                .criteria(Bridge.equal(Datasource.Fields.name, name).equal(Datasource.Fields.workspaceId, workspaceId))
                .permission(aclPermission)
                .one();
    }

    @Override
    public List<Datasource> findAllByIdsWithoutPermission(Set<String> ids, List<String> includeFields) {
        return queryBuilder()
                .criteria(Bridge.in(Datasource.Fields.id, ids))
                .fields(includeFields)
                .all();
    }
}
