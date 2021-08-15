package com.qcmmanager.web.rest;

import com.qcmmanager.domain.QcmGroup;
import com.qcmmanager.repository.QcmGroupRepository;
import com.qcmmanager.security.AuthoritiesConstants;
import com.qcmmanager.service.QcmGroupService;
import com.qcmmanager.service.dto.QcmGroupDTO;
import com.qcmmanager.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.qcmmanager.domain.QcmGroup}.
 */
@RestController
@RequestMapping("/api")
public class QcmGroupResource {

    private final Logger log = LoggerFactory.getLogger(QcmGroupResource.class);

    private static final String ENTITY_NAME = "qcmGroup";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final QcmGroupService qcmGroupService;

    private final QcmGroupRepository qcmGroupRepository;

    public QcmGroupResource(QcmGroupService qcmGroupService, QcmGroupRepository qcmGroupRepository) {
        this.qcmGroupService = qcmGroupService;
        this.qcmGroupRepository = qcmGroupRepository;
    }

    /**
     * {@code POST  /qcm-groups} : Create a new qcmGroup.
     *
     * @param qcmGroup the qcmGroup to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new qcmGroup, or with status {@code 400 (Bad Request)} if the qcmGroup has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/qcm-groups")
    public ResponseEntity<QcmGroup> createQcmGroup(@Valid @RequestBody QcmGroup qcmGroup) throws URISyntaxException {
        log.debug("REST request to save QcmGroup : {}", qcmGroup);
        if (qcmGroup.getId() != null) {
            throw new BadRequestAlertException("A new qcmGroup cannot already have an ID", ENTITY_NAME, "idexists");
        }
        QcmGroup result = qcmGroupService.save(qcmGroup);
        return ResponseEntity
            .created(new URI("/api/qcm-groups/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code POST  /qcm-groups/distribute} : Create a new qcmGroup and distribute qcms to students.
     *
     * @param qcmGroupDTO the qcmGroup to create with qcms attached.
     * @return the {@link ResponseEntity} with status {@code 200 (Ok)}, or with status {@code 400 (Bad Request)} if the qcmGroup has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/qcm-groups/distribute")
    @PreAuthorize("hasAnyAuthority(\"" + AuthoritiesConstants.ADMIN + "\", \"" + AuthoritiesConstants.PROF + "\")")
    public ResponseEntity<Void> createQcmGroupAndDistribute(@Valid @RequestBody QcmGroupDTO qcmGroupDTO) throws URISyntaxException {
        log.debug("REST request to save adn distribute QcmGroup : {}", qcmGroupDTO);
        if (qcmGroupDTO.getId() != null) {
            throw new BadRequestAlertException("A new qcmGroup cannot already have an ID", ENTITY_NAME, "idexists");
        }
        qcmGroupService.saveAndDistributeQcms(qcmGroupDTO);
        return ResponseEntity
            .ok()
            .headers(
                HeaderUtil.createAlert(
                    applicationName,
                    "Le groupe de Qcm " +
                    qcmGroupDTO.getName() +
                    " a bien été créé et les qcms ont été distribués à la classe " +
                    qcmGroupDTO.getClasse().getName() +
                    ".",
                    qcmGroupDTO.getName()
                )
            )
            .build();
    }

    /**
     * {@code PUT  /qcm-groups/:id} : Updates an existing qcmGroup.
     *
     * @param id the id of the qcmGroup to save.
     * @param qcmGroup the qcmGroup to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated qcmGroup,
     * or with status {@code 400 (Bad Request)} if the qcmGroup is not valid,
     * or with status {@code 500 (Internal Server Error)} if the qcmGroup couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/qcm-groups/{id}")
    public ResponseEntity<QcmGroup> updateQcmGroup(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody QcmGroup qcmGroup
    ) throws URISyntaxException {
        log.debug("REST request to update QcmGroup : {}, {}", id, qcmGroup);
        if (qcmGroup.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, qcmGroup.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!qcmGroupRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        QcmGroup result = qcmGroupService.save(qcmGroup);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, qcmGroup.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /qcm-groups/:id} : Partial updates given fields of an existing qcmGroup, field will ignore if it is null
     *
     * @param id the id of the qcmGroup to save.
     * @param qcmGroup the qcmGroup to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated qcmGroup,
     * or with status {@code 400 (Bad Request)} if the qcmGroup is not valid,
     * or with status {@code 404 (Not Found)} if the qcmGroup is not found,
     * or with status {@code 500 (Internal Server Error)} if the qcmGroup couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/qcm-groups/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<QcmGroup> partialUpdateQcmGroup(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody QcmGroup qcmGroup
    ) throws URISyntaxException {
        log.debug("REST request to partial update QcmGroup partially : {}, {}", id, qcmGroup);
        if (qcmGroup.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, qcmGroup.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!qcmGroupRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<QcmGroup> result = qcmGroupService.partialUpdate(qcmGroup);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, qcmGroup.getId().toString())
        );
    }

    /**
     * {@code GET  /qcm-groups} : get all the qcmGroups.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of qcmGroups in body.
     */
    @GetMapping("/qcm-groups")
    public List<QcmGroup> getAllQcmGroups() {
        log.debug("REST request to get all QcmGroups");
        return qcmGroupService.findAll();
    }

    /**
     * {@code GET  /qcm-groups/of-current-prof} : get all the qcmGroups of current prof.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of qcmGroups in body.
     */
    @GetMapping("/qcm-groups/of-current-prof")
    public List<QcmGroup> getAllQcmGroupsOfCurrentProf() {
        log.debug("REST request to get all QcmGroups of current prof");
        return qcmGroupService.findAllOfCurrentProf();
    }

    /**
     * {@code GET  /qcm-groups/:id} : get the "id" qcmGroup.
     *
     * @param id the id of the qcmGroup to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the qcmGroup, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/qcm-groups/{id}")
    public ResponseEntity<QcmGroup> getQcmGroup(@PathVariable Long id) {
        log.debug("REST request to get QcmGroup : {}", id);
        Optional<QcmGroup> qcmGroup = qcmGroupService.findOne(id);
        return ResponseUtil.wrapOrNotFound(qcmGroup);
    }

    /**
     * {@code DELETE  /qcm-groups/:id} : delete the "id" qcmGroup.
     *
     * @param id the id of the qcmGroup to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/qcm-groups/{id}")
    public ResponseEntity<Void> deleteQcmGroup(@PathVariable Long id) {
        log.debug("REST request to delete QcmGroup : {}", id);
        qcmGroupService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
