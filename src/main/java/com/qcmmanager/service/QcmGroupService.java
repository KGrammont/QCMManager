package com.qcmmanager.service;

import com.qcmmanager.domain.QcmGroup;
import com.qcmmanager.repository.QcmGroupRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link QcmGroup}.
 */
@Service
@Transactional
public class QcmGroupService {

    private final Logger log = LoggerFactory.getLogger(QcmGroupService.class);

    private final QcmGroupRepository qcmGroupRepository;

    public QcmGroupService(QcmGroupRepository qcmGroupRepository) {
        this.qcmGroupRepository = qcmGroupRepository;
    }

    /**
     * Save a qcmGroup.
     *
     * @param qcmGroup the entity to save.
     * @return the persisted entity.
     */
    public QcmGroup save(QcmGroup qcmGroup) {
        log.debug("Request to save QcmGroup : {}", qcmGroup);
        return qcmGroupRepository.save(qcmGroup);
    }

    /**
     * Partially update a qcmGroup.
     *
     * @param qcmGroup the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<QcmGroup> partialUpdate(QcmGroup qcmGroup) {
        log.debug("Request to partially update QcmGroup : {}", qcmGroup);

        return qcmGroupRepository
            .findById(qcmGroup.getId())
            .map(
                existingQcmGroup -> {
                    if (qcmGroup.getName() != null) {
                        existingQcmGroup.setName(qcmGroup.getName());
                    }
                    if (qcmGroup.getCreated_at() != null) {
                        existingQcmGroup.setCreated_at(qcmGroup.getCreated_at());
                    }

                    return existingQcmGroup;
                }
            )
            .map(qcmGroupRepository::save);
    }

    /**
     * Get all the qcmGroups.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<QcmGroup> findAll() {
        log.debug("Request to get all QcmGroups");
        return qcmGroupRepository.findAll();
    }

    /**
     * Get one qcmGroup by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<QcmGroup> findOne(Long id) {
        log.debug("Request to get QcmGroup : {}", id);
        return qcmGroupRepository.findById(id);
    }

    /**
     * Delete the qcmGroup by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete QcmGroup : {}", id);
        qcmGroupRepository.deleteById(id);
    }
}
