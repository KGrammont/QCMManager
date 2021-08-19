package com.qcmmanager.service.dto;

import com.qcmmanager.domain.Classe;
import java.time.Instant;

public class QcmGroupDTO {

    private Long id;
    private String name;
    private Instant createdAt;
    private Classe classe;
    private byte[] qcms;

    public QcmGroupDTO() {}

    public QcmGroupDTO(Long id, String name, Instant createdAt, Classe classe, byte[] qcms) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
        this.classe = classe;
        this.qcms = qcms;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Classe getClasse() {
        return classe;
    }

    public void setClasse(Classe classe) {
        this.classe = classe;
    }

    public byte[] getQcms() {
        return qcms;
    }

    public void setQcms(byte[] qcms) {
        this.qcms = qcms;
    }
}
