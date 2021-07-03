package com.qcmmanager.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class QcmMapperTest {

    private QcmMapper qcmMapper;

    @BeforeEach
    public void setUp() {
        qcmMapper = new QcmMapperImpl();
    }
}
