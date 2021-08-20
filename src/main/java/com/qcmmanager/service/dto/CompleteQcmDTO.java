package com.qcmmanager.service.dto;

import java.io.Serializable;

public class CompleteQcmDTO implements Serializable {

    private String name;
    private byte[] pdf;

    public CompleteQcmDTO() {}

    public CompleteQcmDTO(String name, byte[] pdf) {
        this.name = name;
        this.pdf = pdf;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public byte[] getPdf() {
        return pdf;
    }

    public void setPdf(byte[] pdf) {
        this.pdf = pdf;
    }
}
