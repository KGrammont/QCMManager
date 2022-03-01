package com.qcmmanager.repository.custom;

import com.qcmmanager.domain.Authority;
import com.qcmmanager.domain.User;
import com.qcmmanager.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the {@link User} entity.
 */
@Repository
public interface UserCRepository extends UserRepository {
    Page<User> findAllByAuthorities(Authority authority, Pageable pageable);
}
