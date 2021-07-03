package com.qcmmanager.service;

import com.qcmmanager.domain.Qcm;
import com.qcmmanager.repository.QcmRepository;
import com.qcmmanager.service.dto.QcmDTO;
import com.qcmmanager.service.mapper.QcmMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Qcm}.
 */
@Service
@Transactional
public class QcmService {

    private final Logger log = LoggerFactory.getLogger(QcmService.class);

    private final QcmRepository qcmRepository;

    private final QcmMapper qcmMapper;

    public QcmService(QcmRepository qcmRepository, QcmMapper qcmMapper) {
        this.qcmRepository = qcmRepository;
        this.qcmMapper = qcmMapper;
    }

    /**
     * Save a qcm.
     *
     * @param qcmDTO the entity to save.
     * @return the persisted entity.
     */
    public QcmDTO save(QcmDTO qcmDTO) {
        log.debug("Request to save Qcm : {}", qcmDTO);
        Qcm qcm = qcmMapper.toEntity(qcmDTO);
        qcm = qcmRepository.save(qcm);
        return qcmMapper.toDto(qcm);
    }

    /**
     * Partially update a qcm.
     *
     * @param qcmDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<QcmDTO> partialUpdate(QcmDTO qcmDTO) {
        log.debug("Request to partially update Qcm : {}", qcmDTO);

        return qcmRepository
            .findById(qcmDTO.getId())
            .map(
                existingQcm -> {
                    qcmMapper.partialUpdate(existingQcm, qcmDTO);
                    return existingQcm;
                }
            )
            .map(qcmRepository::save)
            .map(qcmMapper::toDto);
    }

    /**
     * Get all the qcms.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<QcmDTO> findAll() {
        log.debug("Request to get all Qcms");
        return qcmRepository.findAll().stream().map(qcmMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one qcm by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<QcmDTO> findOne(Long id) {
        log.debug("Request to get Qcm : {}", id);
        return qcmRepository.findById(id).map(qcmMapper::toDto);
    }

    /**
     * Delete the qcm by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Qcm : {}", id);
        qcmRepository.deleteById(id);
    }
}
