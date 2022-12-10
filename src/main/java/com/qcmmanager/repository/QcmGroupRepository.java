package com.qcmmanager.repository;

import com.qcmmanager.domain.QcmGroup;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the QcmGroup entity.
 */
@Repository
public interface QcmGroupRepository extends JpaRepository<QcmGroup, Long> {
    default Optional<QcmGroup> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<QcmGroup> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<QcmGroup> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct qcmGroup from QcmGroup qcmGroup left join fetch qcmGroup.classe",
        countQuery = "select count(distinct qcmGroup) from QcmGroup qcmGroup"
    )
    Page<QcmGroup> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct qcmGroup from QcmGroup qcmGroup left join fetch qcmGroup.classe")
    List<QcmGroup> findAllWithToOneRelationships();

    @Query("select qcmGroup from QcmGroup qcmGroup left join fetch qcmGroup.classe where qcmGroup.id =:id")
    Optional<QcmGroup> findOneWithToOneRelationships(@Param("id") Long id);
}
