package com.qcmmanager.web.rest;

import com.qcmmanager.domain.Qcm;
import com.qcmmanager.repository.QcmRepository;
import com.qcmmanager.service.QcmService;
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
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.qcmmanager.domain.Qcm}.
 */
@RestController
@RequestMapping("/api")
public class QcmResource {

    private final Logger log = LoggerFactory.getLogger(QcmResource.class);

    private static final String ENTITY_NAME = "qcm";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final QcmService qcmService;

    private final QcmRepository qcmRepository;

    public QcmResource(QcmService qcmService, QcmRepository qcmRepository) {
        this.qcmService = qcmService;
        this.qcmRepository = qcmRepository;
    }

    /**
     * {@code POST  /qcms} : Create a new qcm.
     *
     * @param qcm the qcm to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new qcm, or with status {@code 400 (Bad Request)} if the qcm has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/qcms")
    public ResponseEntity<Qcm> createQcm(@Valid @RequestBody Qcm qcm) throws URISyntaxException {
        log.debug("REST request to save Qcm : {}", qcm);
        if (qcm.getId() != null) {
            throw new BadRequestAlertException("A new qcm cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Qcm result = qcmService.save(qcm);
        return ResponseEntity
            .created(new URI("/api/qcms/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /qcms/:id} : Updates an existing qcm.
     *
     * @param id the id of the qcm to save.
     * @param qcm the qcm to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated qcm,
     * or with status {@code 400 (Bad Request)} if the qcm is not valid,
     * or with status {@code 500 (Internal Server Error)} if the qcm couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/qcms/{id}")
    public ResponseEntity<Qcm> updateQcm(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Qcm qcm)
        throws URISyntaxException {
        log.debug("REST request to update Qcm : {}, {}", id, qcm);
        if (qcm.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, qcm.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!qcmRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Qcm result = qcmService.save(qcm);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, qcm.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /qcms/:id} : Partial updates given fields of an existing qcm, field will ignore if it is null
     *
     * @param id the id of the qcm to save.
     * @param qcm the qcm to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated qcm,
     * or with status {@code 400 (Bad Request)} if the qcm is not valid,
     * or with status {@code 404 (Not Found)} if the qcm is not found,
     * or with status {@code 500 (Internal Server Error)} if the qcm couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/qcms/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Qcm> partialUpdateQcm(@PathVariable(value = "id", required = false) final Long id, @NotNull @RequestBody Qcm qcm)
        throws URISyntaxException {
        log.debug("REST request to partial update Qcm partially : {}, {}", id, qcm);
        if (qcm.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, qcm.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!qcmRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Qcm> result = qcmService.partialUpdate(qcm);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, qcm.getId().toString())
        );
    }

    /**
     * {@code GET  /qcms} : get all the qcms.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of qcms in body.
     */
    @GetMapping("/qcms")
    public List<Qcm> getAllQcms() {
        log.debug("REST request to get all Qcms");
        return qcmService.findAll();
    }

    /**
     * {@code GET  /qcms/:id} : get the "id" qcm.
     *
     * @param id the id of the qcm to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the qcm, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/qcms/{id}")
    public ResponseEntity<Qcm> getQcm(@PathVariable Long id) {
        log.debug("REST request to get Qcm : {}", id);
        Optional<Qcm> qcm = qcmService.findOne(id);
        return ResponseUtil.wrapOrNotFound(qcm);
    }

    /**
     * {@code DELETE  /qcms/:id} : delete the "id" qcm.
     *
     * @param id the id of the qcm to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/qcms/{id}")
    public ResponseEntity<Void> deleteQcm(@PathVariable Long id) {
        log.debug("REST request to delete Qcm : {}", id);
        qcmService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}