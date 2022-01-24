package com.qcmmanager.repository.custom;

import com.qcmmanager.domain.Classe;
import com.qcmmanager.repository.ClasseRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Classe entity.
 */
@Repository
public interface ClasseCRepository extends ClasseRepository {
    @Query(
        value = "select classe from Classe classe where classe.prof.login = ?#{principal.username}",
        countQuery = "select count(distinct classe) from Classe classe where classe.prof.login = ?#{principal.username}"
    )
    Page<Classe> findByProfIsCurrentUser(Pageable pageable);

    @Query(
        value = "select classe from Classe classe left join fetch classe.students where classe.prof.login = ?#{principal.username}",
        countQuery = "select count(distinct classe) from Classe classe where classe.prof.login = ?#{principal.username}"
    )
    Page<Classe> findByProfIsCurrentUserWithEagerRelationships(Pageable pageable);

    @Query("select classe.id from Classe classe where classe.prof.login = ?#{principal.username}")
    List<Long> findClasseIdsByProfIsCurrentUser();
}
