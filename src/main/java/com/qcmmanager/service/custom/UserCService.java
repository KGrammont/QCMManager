package com.qcmmanager.service.custom;

import com.qcmmanager.config.Constants;
import com.qcmmanager.domain.Authority;
import com.qcmmanager.domain.User;
import com.qcmmanager.repository.AuthorityRepository;
import com.qcmmanager.repository.UserRepository;
import com.qcmmanager.repository.custom.UserCRepository;
import com.qcmmanager.security.AuthoritiesConstants;
import com.qcmmanager.security.SecurityUtils;
import com.qcmmanager.service.EmailAlreadyUsedException;
import com.qcmmanager.service.InvalidPasswordException;
import com.qcmmanager.service.UserService;
import com.qcmmanager.service.UsernameAlreadyUsedException;
import com.qcmmanager.service.dto.AdminUserDTO;
import com.qcmmanager.service.dto.AdminUserWithPassDTO;
import com.qcmmanager.service.dto.UserDTO;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.security.RandomUtil;

/**
 * Service class for managing users.
 */
@Service
@Transactional
public class UserCService extends UserService {

    private final Logger log = LoggerFactory.getLogger(UserCService.class);

    private final UserCRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthorityRepository authorityRepository;

    public UserCService(UserCRepository userRepository, PasswordEncoder passwordEncoder, AuthorityRepository authorityRepository) {
        super(userRepository, passwordEncoder, authorityRepository);
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authorityRepository = authorityRepository;
    }

    public Optional<User> requestPasswordReset(String mail) {
        return userRepository
            .findOneByEmailIgnoreCase(mail)
            .filter(User::isActivated)
            .filter(user -> user.getAuthorities().stream().noneMatch(authority -> AuthoritiesConstants.STUDENT.equals(authority.getName())))
            .map(
                user -> {
                    user.setResetKey(RandomUtil.generateResetKey());
                    user.setResetDate(Instant.now());
                    return user;
                }
            );
    }

    public User createStudentWithPass(AdminUserWithPassDTO userDTO) {
        User user = new User();
        user.setLogin(userDTO.getLogin().toLowerCase());
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        if (userDTO.getEmail() != null) {
            user.setEmail(userDTO.getEmail().toLowerCase());
        }
        user.setImageUrl(userDTO.getImageUrl());
        if (userDTO.getLangKey() == null) {
            user.setLangKey(Constants.DEFAULT_LANGUAGE);
        } else {
            user.setLangKey(userDTO.getLangKey());
        }
        String encryptedPassword = passwordEncoder.encode(userDTO.getPass());
        user.setPassword(encryptedPassword);
        user.setResetKey(RandomUtil.generateResetKey());
        user.setResetDate(Instant.now());
        user.setActivated(true);
        Authority authority = new Authority();
        authority.setName(AuthoritiesConstants.STUDENT);
        user.setAuthorities(Set.of(authority));
        userRepository.save(user);
        log.debug("Created Information for User: {}", user);
        return user;
    }

    @Transactional(readOnly = true)
    public Page<AdminUserDTO> getAllManagedStudents(Pageable pageable) {
        Authority studentAuthority = new Authority();
        studentAuthority.setName(AuthoritiesConstants.STUDENT);
        return userRepository.findAllByAuthorities(studentAuthority, pageable).map(AdminUserDTO::new);
    }

    @Transactional(readOnly = true)
    public Page<AdminUserDTO> getAllManagedProfs(Pageable pageable) {
        Authority profAuthority = new Authority();
        profAuthority.setName(AuthoritiesConstants.PROF);
        return userRepository.findAllByAuthorities(profAuthority, pageable).map(AdminUserDTO::new);
    }
}
