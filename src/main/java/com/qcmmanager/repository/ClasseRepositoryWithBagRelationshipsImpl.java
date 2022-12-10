package com.qcmmanager.repository;

import com.qcmmanager.domain.Classe;
import java.util.List;
import java.util.Optional;
import javax.persistence.EntityManager;
import org.hibernate.annotations.QueryHints;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class ClasseRepositoryWithBagRelationshipsImpl implements ClasseRepositoryWithBagRelationships {

    @Autowired
    private EntityManager entityManager;

    @Override
    public Optional<Classe> fetchBagRelationships(Optional<Classe> classe) {
        return classe.map(this::fetchStudents);
    }

    @Override
    public Page<Classe> fetchBagRelationships(Page<Classe> classes) {
        return new PageImpl<>(fetchBagRelationships(classes.getContent()), classes.getPageable(), classes.getTotalElements());
    }

    @Override
    public List<Classe> fetchBagRelationships(List<Classe> classes) {
        return Optional.of(classes).map(this::fetchStudents).get();
    }

    Classe fetchStudents(Classe result) {
        return entityManager
            .createQuery("select classe from Classe classe left join fetch classe.students where classe is :classe", Classe.class)
            .setParameter("classe", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Classe> fetchStudents(List<Classe> classes) {
        return entityManager
            .createQuery("select distinct classe from Classe classe left join fetch classe.students where classe in :classes", Classe.class)
            .setParameter("classes", classes)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
    }
}
