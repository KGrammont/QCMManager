package com.qcmmanager.service;

import com.qcmmanager.domain.Qcm;
import com.qcmmanager.repository.QcmRepository;
import com.qcmmanager.service.dto.CompleteQcmPatch;
import com.qcmmanager.service.pdf.PdfUtils;
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
    private final PdfUtils pdfUtils;
    private final QcmRepository qcmRepository;

    public QcmService(PdfUtils pdfUtils, QcmRepository qcmRepository) {
        this.pdfUtils = pdfUtils;
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
     * Save qcms.
     *
     * @param qcms the qcms to save.
     */
    public List<Qcm> saveAll(List<Qcm> qcms) {
        log.debug("Request to save Qcm : {}", qcms);
        return qcmRepository.saveAll(qcms);
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
                    if (qcm.getCreated_at() != null) {
                        existingQcm.setCreated_at(qcm.getCreated_at());
                    }

                    return existingQcm;
                }
            )
            .map(qcmRepository::save);
    }

    /**
     * Complete form fields of pdf named "name".
     *
     * @param id the id of the qcm to update partially.
     * @param completeQcmPatch with the name of the pdf to update and the new values of the checkoxes.
     * @return the persisted entity.
     */
    public Optional<Qcm> completeQcmWithCheckboxes(long id, CompleteQcmPatch completeQcmPatch) {
        log.debug("Request to fill checkboxes of {} of the Qcm : {}", completeQcmPatch.getName(), id);

        return qcmRepository
            .findById(id)
            .map(
                qcm -> {
                    if (completeQcmPatch.getName().equals("answer")) {
                        byte[] pdfFilled = pdfUtils.getPdfWithUpdatedCheckboxes(qcm.getQuestion(), completeQcmPatch.getCheckboxes());
                        if (pdfFilled != null) {
                            qcm.setAnswerContentType("application/pdf");
                            qcm.setAnswer(pdfFilled);
                        }
                    } else if (completeQcmPatch.getName().equals("completeAnswer")) {
                        byte[] pdfFilled = pdfUtils.getPdfWithUpdatedCheckboxes(qcm.getAnswer(), completeQcmPatch.getCheckboxes());
                        if (pdfFilled != null) {
                            qcm.setCompleteAnswerContentType("application/pdf");
                            qcm.setCompleteAnswer(pdfFilled);
                        }
                    }
                    return qcm;
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
     * Get all qcms for student.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Qcm> findAllOfCurrentProf() {
        log.debug("Request to get all Qcms of prof");
        return qcmRepository.findByQcmGroupClasseProfIsCurrentUser();
    }

    /**
     * Get all qcms for student.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Qcm> findAllOfCurrentStudent() {
        log.debug("Request to get all Qcms of student");
        return qcmRepository.findByStudentIsCurrentUser();
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
