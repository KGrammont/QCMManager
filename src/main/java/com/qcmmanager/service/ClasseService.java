package com.qcmmanager.service;

import com.qcmmanager.domain.Classe;
import com.qcmmanager.repository.ClasseRepository;
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
public class ClasseService {

    private final Logger log = LoggerFactory.getLogger(ClasseService.class);

    private final ClasseRepository classeRepository;

    public ClasseService(ClasseRepository classeRepository) {
        this.classeRepository = classeRepository;
    }

    /**
     * Save a classe.
     *
     * @param classe the entity to save.
     * @return the persisted entity.
     */
    public Classe save(Classe classe) {
        log.debug("Request to save Classe : {}", classe);
        return classeRepository.save(classe);
    }

    /**
     * Partially update a classe.
     *
     * @param classe the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Classe> partialUpdate(Classe classe) {
        log.debug("Request to partially update Classe : {}", classe);

        return classeRepository
            .findById(classe.getId())
            .map(
                existingClasse -> {
                    if (classe.getName() != null) {
                        existingClasse.setName(classe.getName());
                    }

                    return existingClasse;
                }
            )
            .map(classeRepository::save);
    }

    /**
     * Get all the classes.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Classe> findAll(Pageable pageable) {
        log.debug("Request to get all Classes");
        return classeRepository.findAll(pageable);
    }

    /**
     * Get all the classes with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    public Page<Classe> findAllWithEagerRelationships(Pageable pageable) {
        return classeRepository.findAllWithEagerRelationships(pageable);
    }

    /**
     * Get all the classes of the current prof.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Classe> findByProfIsCurrentUser(Pageable pageable) {
        log.debug("Request to get all Classes of the current prof user");
        return classeRepository.findByProfIsCurrentUser(pageable);
    }

    /**
     * Get all the classes of the current prof with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    public Page<Classe> findByProfIsCurrentUserWithEagerRelationships(Pageable pageable) {
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

    /**
     * Get one classe by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Classe> findOne(Long id) {
        log.debug("Request to get Classe : {}", id);
        return classeRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the classe by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Classe : {}", id);
        classeRepository.deleteById(id);
    }
}
