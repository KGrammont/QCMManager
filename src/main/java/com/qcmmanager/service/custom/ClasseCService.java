package com.qcmmanager.service.custom;

import com.qcmmanager.domain.Classe;
import com.qcmmanager.repository.ClasseRepository;
import com.qcmmanager.repository.custom.ClasseCRepository;
import com.qcmmanager.service.ClasseService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Classe}.
 */
@Service
@Transactional
public class ClasseCService extends ClasseService {

    private final Logger log = LoggerFactory.getLogger(ClasseCService.class);

    private final ClasseCRepository classeRepository;

    public ClasseCService(ClasseCRepository classeRepository) {
        super(classeRepository);
        this.classeRepository = classeRepository;
    }

    /**
     * Get all the classes of the current prof.
     *
     * @param pageable the pagination information.
     * @param eagerload with eager relation.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Classe> findByProfIsCurrentUser(Pageable pageable, boolean eagerload) {
        log.debug("Request to get all Classes of the current prof user");
        if (eagerload) {
            return classeRepository.findByProfIsCurrentUserWithEagerRelationships(pageable);
        }
        return classeRepository.findByProfIsCurrentUser(pageable);
    }

    /**
     * Get all classe ids of the current user.
     *
     * @return the list of ids.
     */
    @Transactional(readOnly = true)
    public List<Long> findIdsByProfIsCurrentUser() {
        log.debug("Request to get all Classe ids of the current prof user");
        return classeRepository.findClasseIdsByProfIsCurrentUser();
    }
}
