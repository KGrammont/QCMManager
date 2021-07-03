package com.qcmmanager.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.qcmmanager.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class QcmDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(QcmDTO.class);
        QcmDTO qcmDTO1 = new QcmDTO();
        qcmDTO1.setId(1L);
        QcmDTO qcmDTO2 = new QcmDTO();
        assertThat(qcmDTO1).isNotEqualTo(qcmDTO2);
        qcmDTO2.setId(qcmDTO1.getId());
        assertThat(qcmDTO1).isEqualTo(qcmDTO2);
        qcmDTO2.setId(2L);
        assertThat(qcmDTO1).isNotEqualTo(qcmDTO2);
        qcmDTO1.setId(null);
        assertThat(qcmDTO1).isNotEqualTo(qcmDTO2);
    }
}
