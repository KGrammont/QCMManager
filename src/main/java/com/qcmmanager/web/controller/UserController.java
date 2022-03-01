package com.qcmmanager.web.controller;

import com.qcmmanager.config.Constants;
import com.qcmmanager.domain.User;
import com.qcmmanager.repository.UserRepository;
import com.qcmmanager.security.AuthoritiesConstants;
import com.qcmmanager.service.MailService;
import com.qcmmanager.service.UserService;
import com.qcmmanager.service.custom.UserCService;
import com.qcmmanager.service.dto.AdminUserDTO;
import com.qcmmanager.service.dto.AdminUserWithPassDTO;
import com.qcmmanager.web.rest.errors.BadRequestAlertException;
import com.qcmmanager.web.rest.errors.EmailAlreadyUsedException;
import com.qcmmanager.web.rest.errors.LoginAlreadyUsedException;
import com.qcmmanager.web.rest.vm.UserCreationFeedback;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import javax.validation.*;
import javax.validation.constraints.Pattern;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

@RestController
@RequestMapping("/api/custom")
public class UserController {

    private static final List<String> ALLOWED_ORDERED_PROPERTIES = Collections.unmodifiableList(
        Arrays.asList("id", "login", "firstName", "lastName", "email", "activated", "langKey")
    );

    private final Logger log = LoggerFactory.getLogger(UserController.class);

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserCService userService;

    private final UserRepository userRepository;

    private final MailService mailService;

    public UserController(UserCService userService, UserRepository userRepository, MailService mailService) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.mailService = mailService;
    }

    /**
     * {@code POST  /custom/students}  : Creates a new user with student authority.
     * <p>
     * Creates a new user if the login and email are not already used, account is activated and password set, no email sent.
     *
     * @param userDTO the user to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new user, or with status {@code 400 (Bad Request)} if the login or email is already in use.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     * @throws BadRequestAlertException {@code 400 (Bad Request)} if the login or email is already in use.
     */
    @PostMapping("/students")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.ADMIN + "\", \"" + AuthoritiesConstants.PROF + "\")")
    public ResponseEntity<User> createStudent(@Valid @RequestBody AdminUserWithPassDTO userDTO) throws URISyntaxException {
        log.debug("REST request to save User : {}", userDTO);

        if (userDTO.getId() != null) {
            throw new BadRequestAlertException("A new user cannot already have an ID", "userManagement", "idexists");
            // Lowercase the user login before comparing with database
        } else if (userRepository.findOneByLogin(userDTO.getLogin().toLowerCase()).isPresent()) {
            throw new LoginAlreadyUsedException();
        } else if (userRepository.findOneByEmailIgnoreCase(userDTO.getEmail()).isPresent()) {
            throw new EmailAlreadyUsedException();
        } else {
            User newUser = userService.createStudentWithPass(userDTO);
            return ResponseEntity
                .created(new URI("/api/admin/users/" + newUser.getLogin()))
                .headers(
                    HeaderUtil.createAlert(
                        applicationName,
                        "L'élève " + newUser.getFirstName() + " " + newUser.getLastName() + " a bien été créé.",
                        newUser.getLogin()
                    )
                )
                .body(newUser);
        }
    }

    /**
     * {@code POST  /custom/students/multiple}  : Creates a set of users with student authority.
     * <p>
     * Creates a set of users if the login and email are not already used, account is activated and password set, no email sent.
     *
     * @param users the user to create.
     * @return the {@link ResponseEntity} with status {@code 200 (Ok)} and with body the description of the creation.
     */
    @PostMapping("/students/multiple")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.ADMIN + "\", \"" + AuthoritiesConstants.PROF + "\")")
    public ResponseEntity<List<UserCreationFeedback>> createStudents(@Valid @RequestBody List<AdminUserWithPassDTO> users) {
        log.debug("REST request to save Users : {}", users);
        List<UserCreationFeedback> feedbacks = new ArrayList<>();

        users.forEach(
            userDTO -> {
                ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
                Validator validator = factory.getValidator();
                Set<ConstraintViolation<AdminUserWithPassDTO>> validationErrors = validator.validate(userDTO);
                if (!validationErrors.isEmpty()) {
                    StringJoiner errors = new StringJoiner("/n");
                    validationErrors.forEach(
                        constraint -> {
                            errors.add(String.format("Contrainte sur '%s' : %s.", constraint.getPropertyPath(), constraint.getMessage()));
                        }
                    );
                    feedbacks.add(new UserCreationFeedback(userDTO.getEmail(), false, errors.toString()));
                } else if (userDTO.getId() != null) {
                    throw new BadRequestAlertException("A new user cannot already have an ID", "userManagement", "idexists");
                } else if (userRepository.findOneByLogin(userDTO.getLogin().toLowerCase()).isPresent()) {
                    feedbacks.add(new UserCreationFeedback(userDTO.getEmail(), false, "Le login est déjà utilisé."));
                } else if (userRepository.findOneByEmailIgnoreCase(userDTO.getEmail()).isPresent()) {
                    feedbacks.add(new UserCreationFeedback(userDTO.getEmail(), false, "L'email est déjà utilisé."));
                } else {
                    userService.createStudentWithPass(userDTO);
                    feedbacks.add(new UserCreationFeedback(userDTO.getEmail(), true, "Créé"));
                }
            }
        );
        return ResponseEntity.ok(feedbacks);
    }

    /**
     * {@code PUT /custom/users} : Updates an existing User.
     *
     * @param userDTO the user to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated user.
     * @throws EmailAlreadyUsedException {@code 400 (Bad Request)} if the email is already in use.
     * @throws LoginAlreadyUsedException {@code 400 (Bad Request)} if the login is already in use.
     */
    @PutMapping("/users")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.ADMIN + "\", \"" + AuthoritiesConstants.PROF + "\")")
    public ResponseEntity<AdminUserDTO> updateUser(@Valid @RequestBody AdminUserDTO userDTO) {
        log.debug("REST request to update User : {}", userDTO);
        Optional<User> existingUser = userRepository.findOneByEmailIgnoreCase(userDTO.getEmail());
        if (existingUser.isPresent() && (!existingUser.get().getId().equals(userDTO.getId()))) {
            throw new EmailAlreadyUsedException();
        }
        existingUser = userRepository.findOneByLogin(userDTO.getLogin().toLowerCase());
        if (existingUser.isPresent() && (!existingUser.get().getId().equals(userDTO.getId()))) {
            throw new LoginAlreadyUsedException();
        }
        Optional<AdminUserDTO> updatedUser = userService.updateUser(userDTO);

        return ResponseUtil.wrapOrNotFound(
            updatedUser,
            HeaderUtil.createAlert(
                applicationName,
                "L'utilisateur " + userDTO.getFirstName() + " " + userDTO.getLastName() + " a bien été mis à jour.",
                userDTO.getLogin()
            )
        );
    }

    /**
     * {@code GET /custom/users/:login} : get the "login" user.
     *
     * @param login the login of the user to find.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the "login" user, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/users/{login}")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.ADMIN + "\", \"" + AuthoritiesConstants.PROF + "\")")
    public ResponseEntity<AdminUserDTO> getUser(@PathVariable @Pattern(regexp = Constants.LOGIN_REGEX) String login) {
        log.debug("REST request to get User : {}", login);
        return ResponseUtil.wrapOrNotFound(userService.getUserWithAuthoritiesByLogin(login).map(AdminUserDTO::new));
    }

    /**
     * {@code DELETE /custom/users/:login} : delete the "login" User.
     *
     * @param login the login of the user to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/users/{login}")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.ADMIN + "\", \"" + AuthoritiesConstants.PROF + "\")")
    public ResponseEntity<Void> deleteUser(@PathVariable @Pattern(regexp = Constants.LOGIN_REGEX) String login) {
        log.debug("REST request to delete User: {}", login);
        userService.deleteUser(login);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createAlert(applicationName, "L'utilisateur " + login + " a bien été supprimé.", login))
            .build();
    }
}
