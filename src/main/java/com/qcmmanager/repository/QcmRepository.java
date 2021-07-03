package com.qcmmanager.repository;

import com.qcmmanager.domain.Qcm;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Qcm entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QcmRepository extends JpaRepository<Qcm, Long> {}
