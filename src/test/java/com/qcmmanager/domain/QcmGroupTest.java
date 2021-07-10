package com.qcmmanager.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.qcmmanager.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class QcmGroupTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(QcmGroup.class);
        QcmGroup qcmGroup1 = new QcmGroup();
        qcmGroup1.setId(1L);
        QcmGroup qcmGroup2 = new QcmGroup();
        qcmGroup2.setId(qcmGroup1.getId());
        assertThat(qcmGroup1).isEqualTo(qcmGroup2);
        qcmGroup2.setId(2L);
        assertThat(qcmGroup1).isNotEqualTo(qcmGroup2);
        qcmGroup1.setId(null);
        assertThat(qcmGroup1).isNotEqualTo(qcmGroup2);
    }
}
