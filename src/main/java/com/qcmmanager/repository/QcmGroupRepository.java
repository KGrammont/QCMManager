package com.qcmmanager.repository;

import com.qcmmanager.domain.QcmGroup;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the QcmGroup entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QcmGroupRepository extends JpaRepository<QcmGroup, Long> {}
