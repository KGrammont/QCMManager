package com.qcmmanager.repository;

import com.qcmmanager.domain.Qcm;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Qcm entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QcmRepository extends JpaRepository<Qcm, Long> {
    @Query("select qcm from Qcm qcm where qcm.qcmGroup.classe.prof.login = ?#{principal.username}")
    List<Qcm> findByQcmGroupClasseProfIsCurrentUser();

    @Query("select qcm from Qcm qcm where qcm.student.login = ?#{principal.username}")
    List<Qcm> findByStudentIsCurrentUser();
}
