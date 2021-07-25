package com.qcmmanager.service;

import com.qcmmanager.domain.Qcm;
import com.qcmmanager.repository.QcmRepository;
import java.util.List;
import java.util.Optional;
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

    public QcmService(QcmRepository qcmRepository) {
        this.qcmRepository = qcmRepository;
    }

    /**
     * Save a qcm.
     *
     * @param qcm the entity to save.
     * @return the persisted entity.
     */
    public Qcm save(Qcm qcm) {
        log.debug("Request to save Qcm : {}", qcm);
        return qcmRepository.save(qcm);
    }

    /**
     * Partially update a qcm.
     *
     * @param qcm the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Qcm> partialUpdate(Qcm qcm) {
        log.debug("Request to partially update Qcm : {}", qcm);

        return qcmRepository
            .findById(qcm.getId())
            .map(
                existingQcm -> {
                    if (qcm.getQuestion() != null) {
                        existingQcm.setQuestion(qcm.getQuestion());
                    }
                    if (qcm.getQuestionContentType() != null) {
                        existingQcm.setQuestionContentType(qcm.getQuestionContentType());
                    }
                    if (qcm.getAnswer() != null) {
                        existingQcm.setAnswer(qcm.getAnswer());
                    }
                    if (qcm.getAnswerContentType() != null) {
                        existingQcm.setAnswerContentType(qcm.getAnswerContentType());
                    }
                    if (qcm.getCompleteAnswer() != null) {
                        existingQcm.setCompleteAnswer(qcm.getCompleteAnswer());
                    }
                    if (qcm.getCompleteAnswerContentType() != null) {
                        existingQcm.setCompleteAnswerContentType(qcm.getCompleteAnswerContentType());
                    }
                    if (qcm.getCorrection() != null) {
                        existingQcm.setCorrection(qcm.getCorrection());
                    }
                    if (qcm.getCorrectionContentType() != null) {
                        existingQcm.setCorrectionContentType(qcm.getCorrectionContentType());
                    }

                    return existingQcm;
                }
            )
            .map(qcmRepository::save);
    }

    /**
     * Get all the qcms.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Qcm> findAll() {
        log.debug("Request to get all Qcms");
        return qcmRepository.findAll();
    }

    /**
     * Get one qcm by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Qcm> findOne(Long id) {
        log.debug("Request to get Qcm : {}", id);
        return qcmRepository.findById(id);
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
