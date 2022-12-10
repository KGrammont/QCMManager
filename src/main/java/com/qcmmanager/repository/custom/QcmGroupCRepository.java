package com.qcmmanager.repository.custom;

import com.qcmmanager.domain.QcmGroup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data SQL repository for the QcmGroup entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QcmGroupCRepository extends JpaRepository<QcmGroup, Long> {
    @Query("select qcmGroup from QcmGroup qcmGroup where qcmGroup.classe.id in (:classeIds)")
    Page<QcmGroup> findAllByClasseIdIn(List<Long> classeIds, Pageable pageable);
}
