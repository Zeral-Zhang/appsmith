package com.appsmith.server.services;

import com.appsmith.server.domains.User;
import com.appsmith.server.exceptions.AppsmithError;
import com.appsmith.server.exceptions.AppsmithException;
import com.appsmith.server.helpers.BeanCopyUtils;
import com.appsmith.server.repositories.UserRepository;
import com.segment.analytics.Analytics;
import com.segment.analytics.messages.IdentifyMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.convert.MongoConverter;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Scheduler;

import javax.validation.Validator;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class UserServiceImpl extends BaseService<UserRepository, User, String> implements UserService, UserDetailsService {

    private UserRepository repository;
    private final OrganizationService organizationService;
    private final Analytics analytics;

    @Autowired
    public UserServiceImpl(Scheduler scheduler,
                           Validator validator,
                           MongoConverter mongoConverter,
                           ReactiveMongoTemplate reactiveMongoTemplate,
                           UserRepository repository,
                           OrganizationService organizationService,
                           Analytics analytics,
                           SessionUserService sessionUserService) {
        super(scheduler, validator, mongoConverter, reactiveMongoTemplate, repository, analytics, sessionUserService);
        this.repository = repository;
        this.organizationService = organizationService;
        this.analytics = analytics;
    }

    @Override
    public Mono<User> findByUsername(String name) {
        return repository.findByName(name);
    }

    @Override
    public Mono<User> findByEmail(String email) {
        return repository.findByEmail(email);
    }

    @Override
    public Mono<User> create(User user) {

        Mono<User> savedUserMono = repository.save(user);
        return savedUserMono
                .map(savedUser -> {
                    Map<String, String> traitsMap = new HashMap<>();
                    traitsMap.put("name", savedUser.getName());
                    traitsMap.put("email", savedUser.getEmail());
                    analytics.enqueue(IdentifyMessage.builder()
                            .userId(savedUser.getId())
                            .traits(traitsMap)
                    );
                    analytics.flush();
                    return savedUser;
                });
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return repository.findByName(username).block();
    }

    @Override
    public Mono<User> update(String id, User userUpdate) {
        Mono<User> userFromRepository = repository.findById(id);

        return Mono.just(userUpdate)
                .flatMap(this::validateUpdate)
                //Once the new update has been validated, update the user with the new fields.
                .then(userFromRepository)
                .switchIfEmpty(Mono.error(new AppsmithException(AppsmithError.INVALID_PARAMETER, id)))
                .map(existingUser -> {
                    BeanCopyUtils.copyNewFieldValuesIntoOldObject(userUpdate, existingUser);
                    return existingUser;
                })
                .flatMap(repository::save);
    }

    //Validation for user update. Right now it only validates the organization id. Other checks can be added
    //here in the future.
    private Mono<User> validateUpdate(User updateUser) {
        if (updateUser.getOrganizationId() == null) {
            //No organization present implies the update to the user is not to the organization id. No checks currently
            //for this scenario. Return the user successfully.
            return Mono.just(updateUser);
        }
        return organizationService.findById(updateUser.getOrganizationId())
                //If the organization is not found in the repository, throw an error
                .switchIfEmpty(Mono.error(new AppsmithException(AppsmithError.INVALID_PARAMETER, updateUser.getOrganizationId())))
                .then(Mono.just(updateUser));

    }

}
