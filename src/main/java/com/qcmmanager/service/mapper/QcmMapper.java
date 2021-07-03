package com.qcmmanager.service.mapper;

import com.qcmmanager.domain.*;
import com.qcmmanager.service.dto.QcmDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Qcm} and its DTO {@link QcmDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface QcmMapper extends EntityMapper<QcmDTO, Qcm> {}
