package com.qcmmanager.repository;

import com.qcmmanager.domain.Qcm;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Qcm entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QcmRepository extends JpaRepository<Qcm, Long> {
    @Query(value = "select qcm from Qcm qcm where qcm.qcmGroup.classe.prof.login = ?#{principal.username}")
    Page<Qcm> findByQcmGroupClasseProfIsCurrentUser(Pageable pageable);

    @Query(value = "select qcm from Qcm qcm where qcm.student.login = ?#{principal.username}")
    Page<Qcm> findByStudentIsCurrentUser(Pageable pageable);

    @Query(value = "select qcm from Qcm qcm where qcm.qcmGroup.id = :groupId")
    List<Qcm> findByQcmGroupId(Long groupId);

    @Modifying
    @Query(value = "delete from Qcm qcm where qcm.qcmGroup.id = :groupId")
    void deleteByQcmGroupId(Long groupId);
}
