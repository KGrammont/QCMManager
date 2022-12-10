package com.qcmmanager.service.custom;

import com.qcmmanager.domain.Qcm;
import com.qcmmanager.domain.QcmGroup;
import com.qcmmanager.domain.User;
import com.qcmmanager.repository.custom.QcmGroupCRepository;
import com.qcmmanager.service.dto.QcmGroupDTO;
import com.qcmmanager.service.mapper.QcmGroupMapper;
import com.qcmmanager.service.pdf.PdfUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Service Implementation for managing {@link QcmGroup}.
 */
@Service
@Transactional
public class QcmGroupCService {

    private final Logger log = LoggerFactory.getLogger(QcmGroupCService.class);
    private final ClasseCService classeService;
    private final QcmCService qcmService;
    private final PdfUtils pdfUtils;
    private final QcmGroupMapper qcmGroupMapper;
    private final QcmGroupCRepository qcmGroupRepository;

    public QcmGroupCService(
        ClasseCService classeService,
        QcmCService qcmService,
        PdfUtils pdfUtils,
        QcmGroupMapper qcmGroupMapper,
        QcmGroupCRepository qcmGroupRepository
    ) {
        this.classeService = classeService;
        this.qcmService = qcmService;
        this.pdfUtils = pdfUtils;
        this.qcmGroupMapper = qcmGroupMapper;
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
     * Call save and distribute qcms.
     *
     * @param qcmGroupDTO the entity to save.
     */
    public void saveAndDistributeQcms(QcmGroupDTO qcmGroupDTO) {
        QcmGroup qcmGroup = qcmGroupMapper.qcmGroupDTOToQcmGroup(qcmGroupDTO);
        QcmGroup savedQcmGroup = qcmGroupRepository.save(qcmGroup);
        List<byte[]> splitEditableQcms = pdfUtils.getSplitEditableQcms(qcmGroupDTO.getQcms());
        Set<User> students = qcmGroupDTO.getClasse().getStudents();
        List<Qcm> qcms = distribute(students, splitEditableQcms, savedQcmGroup);
        qcmService.saveAll(qcms);
    }

    private List<Qcm> distribute(Set<User> students, List<byte[]> splitEditableQcms, QcmGroup qcmGroup) {
        int qcmNumber = splitEditableQcms.size();
        List<Qcm> qcms = new ArrayList<>();
        int index = -1;
        for (User student : students) {
            index++;
            qcms.add(
                new Qcm()
                    .qcmGroup(qcmGroup)
                    .student(student)
                    .created_at(qcmGroup.getCreated_at())
                    .questionContentType("application/pdf")
                    .question(splitEditableQcms.get(index % qcmNumber))
            );
        }
        return qcms;
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
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<QcmGroup> findAll(Pageable pageable) {
        log.debug("Request to get all QcmGroups");
        return qcmGroupRepository.findAll(pageable);
    }

    /**
     * Get all the qcmGroups of current prof.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<QcmGroup> findAllOfCurrentProf(Pageable pageable) {
        List<Long> classeIds = classeService.findIdsByProfIsCurrentUser();
        log.debug("Request to get all QcmGroups of classes");
        return qcmGroupRepository.findAllByClasseIdIn(classeIds, pageable);
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
        qcmService.deleteByQcmGroupId(id);
        qcmGroupRepository.deleteById(id);
    }
}
