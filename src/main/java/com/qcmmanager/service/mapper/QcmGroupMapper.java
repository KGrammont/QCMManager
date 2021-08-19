package com.qcmmanager.service.mapper;

import com.qcmmanager.domain.QcmGroup;
import com.qcmmanager.service.dto.QcmGroupDTO;
import org.springframework.stereotype.Service;

@Service
public class QcmGroupMapper {

    public QcmGroup qcmGroupDTOToQcmGroup(QcmGroupDTO qcmGroupDTO) {
        if (qcmGroupDTO == null) {
            return null;
        } else {
            return new QcmGroup()
                .id(qcmGroupDTO.getId())
                .name(qcmGroupDTO.getName())
                .createdAt(qcmGroupDTO.getCreatedAt())
                .classe(qcmGroupDTO.getClasse());
        }
    }
}
