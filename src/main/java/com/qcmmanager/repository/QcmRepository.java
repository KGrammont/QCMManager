package com.qcmmanager.repository;

import com.qcmmanager.domain.Qcm;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Qcm entity.
 */
@Repository
public interface QcmRepository extends JpaRepository<Qcm, Long> {
    @Query("select qcm from Qcm qcm where qcm.student.login = ?#{principal.username}")
    List<Qcm> findByStudentIsCurrentUser();

    default Optional<Qcm> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Qcm> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Qcm> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct qcm from Qcm qcm left join fetch qcm.qcmGroup left join fetch qcm.student",
        countQuery = "select count(distinct qcm) from Qcm qcm"
    )
    Page<Qcm> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct qcm from Qcm qcm left join fetch qcm.qcmGroup left join fetch qcm.student")
    List<Qcm> findAllWithToOneRelationships();

    @Query("select qcm from Qcm qcm left join fetch qcm.qcmGroup left join fetch qcm.student where qcm.id =:id")
    Optional<Qcm> findOneWithToOneRelationships(@Param("id") Long id);
}
