package com.qcmmanager.repository;

import com.qcmmanager.domain.Classe;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Classe entity.
 */
@Repository
public interface ClasseRepository extends JpaRepository<Classe, Long> {
    @Query(
        value = "select classe from Classe classe where classe.prof.login = ?#{principal.username}",
        countQuery = "select count(distinct classe) from Classe classe where classe.prof.login = ?#{principal.username}"
    )
    Page<Classe> findByProfIsCurrentUser(Pageable pageable);

    @Query("select classe.id from Classe classe where classe.prof.login = ?#{principal.username}")
    List<Long> findClasseIdsByProfIsCurrentUser();

    @Query(
        value = "select distinct classe from Classe classe left join fetch classe.students",
        countQuery = "select count(distinct classe) from Classe classe"
    )
    Page<Classe> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct classe from Classe classe left join fetch classe.students")
    List<Classe> findAllWithEagerRelationships();

    @Query("select classe from Classe classe left join fetch classe.students where classe.id =:id")
    Optional<Classe> findOneWithEagerRelationships(@Param("id") Long id);
}
