package com.qcmmanager.repository;

import com.qcmmanager.domain.QcmGroup;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the QcmGroup entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QcmGroupRepository extends JpaRepository<QcmGroup, Long> {
    @Query("select qcmGroup from QcmGroup qcmGroup where qcmGroup.classe.id in (:classeIds)")
    List<QcmGroup> findAllByClasseIdIn(List<Long> classeIds);
}
