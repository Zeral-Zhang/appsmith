package com.appsmith.server.repositories.ce;

import com.appsmith.external.models.BranchAwareDomain;
import com.appsmith.server.acl.AclPermission;
import com.appsmith.server.constants.FieldName;
import com.appsmith.server.domains.NewPage;
import com.appsmith.server.domains.QNewPage;
import com.appsmith.server.dtos.PageDTO;
import com.appsmith.server.repositories.BaseAppsmithRepositoryImpl;
import com.appsmith.server.repositories.CacheableRepositoryHelper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.ReactiveMongoOperations;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.Fields;
import org.springframework.data.mongodb.core.convert.MongoConverter;
import org.springframework.data.mongodb.core.query.Criteria;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.springframework.data.mongodb.core.query.Criteria.where;

@Slf4j
public class CustomNewPageRepositoryCEImpl extends BaseAppsmithRepositoryImpl<NewPage>
        implements CustomNewPageRepositoryCE {

    private final MongoTemplate mongoTemplate;

    public CustomNewPageRepositoryCEImpl(
            ReactiveMongoOperations mongoOperations,
            MongoConverter mongoConverter,
            CacheableRepositoryHelper cacheableRepositoryHelper,
            MongoTemplate mongoTemplate) {
        super(mongoOperations, mongoConverter, cacheableRepositoryHelper);
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public Flux<NewPage> findByApplicationId(String applicationId, AclPermission aclPermission) {
        Criteria applicationIdCriteria = where(NewPage.Fields.applicationId).is(applicationId);
        return queryBuilder()
                .criteria(applicationIdCriteria)
                .permission(aclPermission)
                .all();
    }

    @Override
    public Flux<NewPage> findByApplicationId(String applicationId, Optional<AclPermission> permission) {
        Criteria applicationIdCriteria = where(NewPage.Fields.applicationId).is(applicationId);
        return queryBuilder()
                .criteria(applicationIdCriteria)
                .permission(permission.orElse(null))
                .all();
    }

    @Override
    public Flux<NewPage> findByApplicationIdAndNonDeletedEditMode(String applicationId, AclPermission aclPermission) {
        Criteria applicationIdCriteria = where(NewPage.Fields.applicationId).is(applicationId);
        // In case a page has been deleted in edit mode, but still exists in deployed mode, NewPage object would exist.
        // To handle this, only fetch non-deleted pages
        Criteria activeEditModeCriteria = where(
                        NewPage.Fields.unpublishedPage + "." + fieldName(QNewPage.newPage.unpublishedPage.deletedAt))
                .is(null);
        return queryBuilder()
                .criteria(applicationIdCriteria, activeEditModeCriteria)
                .permission(aclPermission)
                .all();
    }

    @Override
    public Mono<NewPage> findByIdAndLayoutsIdAndViewMode(
            String id, String layoutId, AclPermission aclPermission, Boolean viewMode) {
        String layoutsIdKey;
        String layoutsKey;

        List<Criteria> criteria = new ArrayList<>();
        Criteria idCriterion = getIdCriteria(id);
        criteria.add(idCriterion);

        if (Boolean.TRUE.equals(viewMode)) {
            layoutsKey = NewPage.Fields.publishedPage + "." + fieldName(QNewPage.newPage.publishedPage.layouts);
        } else {
            layoutsKey = NewPage.Fields.unpublishedPage + "." + fieldName(QNewPage.newPage.unpublishedPage.layouts);

            // In case a page has been deleted in edit mode, but still exists in deployed mode, NewPage object would
            // exist. To handle this, only fetch non-deleted pages
            Criteria deletedCriterion = where(NewPage.Fields.unpublishedPage + "."
                            + fieldName(QNewPage.newPage.unpublishedPage.deletedAt))
                    .is(null);
            criteria.add(deletedCriterion);
        }
        layoutsIdKey = layoutsKey + "." + FieldName.ID;

        Criteria layoutCriterion = where(layoutsIdKey).is(layoutId);
        criteria.add(layoutCriterion);

        return queryBuilder().criteria(criteria).permission(aclPermission).one();
    }

    @Override
    public Mono<NewPage> findByNameAndViewMode(String name, AclPermission aclPermission, Boolean viewMode) {

        List<Criteria> criteria = new ArrayList<>();

        Criteria nameCriterion = getNameCriterion(name, viewMode);
        criteria.add(nameCriterion);

        if (Boolean.FALSE.equals(viewMode)) {
            // In case a page has been deleted in edit mode, but still exists in deployed mode, NewPage object would
            // exist. To handle this, only fetch non-deleted pages
            Criteria deletedCriterion = where(NewPage.Fields.unpublishedPage + "."
                            + fieldName(QNewPage.newPage.unpublishedPage.deletedAt))
                    .is(null);
            criteria.add(deletedCriterion);
        }

        return queryBuilder().criteria(criteria).permission(aclPermission).one();
    }

    @Override
    public Mono<NewPage> findByNameAndApplicationIdAndViewMode(
            String name, String applicationId, AclPermission aclPermission, Boolean viewMode) {

        List<Criteria> criteria = new ArrayList<>();

        Criteria nameCriterion = getNameCriterion(name, viewMode);
        criteria.add(nameCriterion);

        Criteria applicationIdCriterion = where(NewPage.Fields.applicationId).is(applicationId);
        criteria.add(applicationIdCriterion);

        if (Boolean.FALSE.equals(viewMode)) {
            // In case a page has been deleted in edit mode, but still exists in deployed mode, NewPage object would
            // exist. To handle this, only fetch non-deleted pages
            Criteria deletedCriteria = where(NewPage.Fields.unpublishedPage + "."
                            + fieldName(QNewPage.newPage.unpublishedPage.deletedAt))
                    .is(null);
            criteria.add(deletedCriteria);
        }

        return queryBuilder().criteria(criteria).permission(aclPermission).one();
    }

    @Override
    public Flux<NewPage> findAllPageDTOsByIds(List<String> ids, AclPermission aclPermission) {
        ArrayList<String> includedFields = new ArrayList<>(List.of(
                FieldName.APPLICATION_ID,
                FieldName.DEFAULT_RESOURCES,
                NewPage.Fields.policies,
                (NewPage.Fields.unpublishedPage + "." + fieldName(QNewPage.newPage.unpublishedPage.name)),
                (NewPage.Fields.unpublishedPage + "." + fieldName(QNewPage.newPage.unpublishedPage.icon)),
                (NewPage.Fields.unpublishedPage + "." + fieldName(QNewPage.newPage.unpublishedPage.isHidden)),
                (NewPage.Fields.unpublishedPage + "." + fieldName(QNewPage.newPage.unpublishedPage.slug)),
                (NewPage.Fields.unpublishedPage + "." + fieldName(QNewPage.newPage.unpublishedPage.customSlug)),
                (NewPage.Fields.publishedPage + "." + fieldName(QNewPage.newPage.unpublishedPage.name)),
                (NewPage.Fields.publishedPage + "." + fieldName(QNewPage.newPage.unpublishedPage.icon)),
                (NewPage.Fields.publishedPage + "." + fieldName(QNewPage.newPage.unpublishedPage.isHidden)),
                (NewPage.Fields.publishedPage + "." + fieldName(QNewPage.newPage.unpublishedPage.slug)),
                (NewPage.Fields.publishedPage + "." + fieldName(QNewPage.newPage.unpublishedPage.customSlug))));

        Criteria idsCriterion = where("id").in(ids);

        return this.queryBuilder()
                .criteria(idsCriterion)
                .fields(includedFields)
                .permission(aclPermission)
                .all();
    }

    private Criteria getNameCriterion(String name, Boolean viewMode) {
        String nameKey;

        if (Boolean.TRUE.equals(viewMode)) {
            nameKey = NewPage.Fields.publishedPage + "." + fieldName(QNewPage.newPage.publishedPage.name);
        } else {
            nameKey = NewPage.Fields.unpublishedPage + "." + fieldName(QNewPage.newPage.unpublishedPage.name);
        }
        return where(nameKey).is(name);
    }

    @Override
    public Mono<String> getNameByPageId(String pageId, boolean isPublishedName) {
        return queryBuilder().byId(pageId).one().map(p -> {
            PageDTO page = (isPublishedName ? p.getPublishedPage() : p.getUnpublishedPage());
            if (page != null) {
                return page.getName();
            }
            // If the page hasn't been published, just send the unpublished page name
            return p.getUnpublishedPage().getName();
        });
    }

    @Override
    public Mono<NewPage> findPageByBranchNameAndDefaultPageId(
            String branchName, String defaultPageId, AclPermission permission) {
        final String defaultResources = NewPage.Fields.defaultResources;
        Criteria defaultPageIdCriteria =
                where(defaultResources + "." + FieldName.PAGE_ID).is(defaultPageId);
        Criteria branchCriteria =
                where(defaultResources + "." + FieldName.BRANCH_NAME).is(branchName);
        return queryBuilder()
                .criteria(defaultPageIdCriteria, branchCriteria)
                .permission(permission)
                .one();
    }

    @Override
    public Flux<NewPage> findSlugsByApplicationIds(List<String> applicationIds, AclPermission aclPermission) {
        Criteria applicationIdCriteria = where(NewPage.Fields.applicationId).in(applicationIds);
        String unpublishedSlugFieldPath = String.format(
                "%s.%s", NewPage.Fields.unpublishedPage, fieldName(QNewPage.newPage.unpublishedPage.slug));
        String unpublishedCustomSlugFieldPath = String.format(
                "%s.%s", NewPage.Fields.unpublishedPage, fieldName(QNewPage.newPage.unpublishedPage.customSlug));
        String publishedSlugFieldPath =
                String.format("%s.%s", NewPage.Fields.publishedPage, fieldName(QNewPage.newPage.publishedPage.slug));
        String publishedCustomSlugFieldPath = String.format(
                "%s.%s", NewPage.Fields.publishedPage, fieldName(QNewPage.newPage.publishedPage.customSlug));
        String applicationIdFieldPath = NewPage.Fields.applicationId;

        return queryBuilder()
                .criteria(applicationIdCriteria)
                .fields(
                        unpublishedSlugFieldPath,
                        unpublishedCustomSlugFieldPath,
                        publishedSlugFieldPath,
                        publishedCustomSlugFieldPath,
                        applicationIdFieldPath)
                .permission(aclPermission)
                .all();
    }

    @Override
    public Mono<NewPage> findByGitSyncIdAndDefaultApplicationId(
            String defaultApplicationId, String gitSyncId, AclPermission permission) {
        return findByGitSyncIdAndDefaultApplicationId(defaultApplicationId, gitSyncId, Optional.ofNullable(permission));
    }

    @Override
    public Mono<NewPage> findByGitSyncIdAndDefaultApplicationId(
            String defaultApplicationId, String gitSyncId, Optional<AclPermission> permission) {
        final String defaultResources = BranchAwareDomain.Fields.defaultResources;
        Criteria defaultAppIdCriteria =
                where(defaultResources + "." + FieldName.APPLICATION_ID).is(defaultApplicationId);
        Criteria gitSyncIdCriteria = where(FieldName.GIT_SYNC_ID).is(gitSyncId);
        return queryBuilder()
                .criteria(defaultAppIdCriteria, gitSyncIdCriteria)
                .permission(permission.orElse(null))
                .first();
    }

    @Override
    public Mono<Void> publishPages(Collection<String> pageIds, AclPermission permission) {
        Criteria applicationIdCriteria = where(NewPage.Fields.id).in(pageIds);

        Mono<Set<String>> permissionGroupsMono =
                getCurrentUserPermissionGroupsIfRequired(Optional.ofNullable(permission));

        return permissionGroupsMono.flatMap(permissionGroups -> {
            return Mono.fromCallable(() -> {
                        AggregationOperation matchAggregationWithPermission = null;
                        if (permission == null) {
                            matchAggregationWithPermission =
                                    Aggregation.match(new Criteria().andOperator(notDeleted()));
                        } else {
                            matchAggregationWithPermission = Aggregation.match(
                                    new Criteria().andOperator(notDeleted(), userAcl(permissionGroups, permission)));
                        }
                        AggregationOperation matchAggregation = Aggregation.match(applicationIdCriteria);
                        AggregationOperation wholeProjection = Aggregation.project(NewPage.class);
                        AggregationOperation addFieldsOperation = Aggregation.addFields()
                                .addField(NewPage.Fields.publishedPage)
                                .withValueOf(Fields.field(NewPage.Fields.unpublishedPage))
                                .build();
                        Aggregation combinedAggregation = Aggregation.newAggregation(
                                matchAggregation, matchAggregationWithPermission, wholeProjection, addFieldsOperation);
                        return mongoTemplate.aggregate(combinedAggregation, NewPage.class, NewPage.class);
                    })
                    .subscribeOn(Schedulers.boundedElastic())
                    .flatMap(updatedResults -> bulkUpdate(updatedResults.getMappedResults()));
        });
    }

    @Override
    public Flux<NewPage> findAllByApplicationIdsWithoutPermission(
            List<String> applicationIds, List<String> includeFields) {
        Criteria applicationCriteria = Criteria.where(FieldName.APPLICATION_ID).in(applicationIds);
        return queryBuilder()
                .criteria(applicationCriteria)
                .fields(includeFields)
                .all();
    }
}