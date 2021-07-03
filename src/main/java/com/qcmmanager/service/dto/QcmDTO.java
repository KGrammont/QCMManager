package com.qcmmanager.service.dto;

import java.io.Serializable;
import java.util.Objects;
import javax.persistence.Lob;

/**
 * A DTO for the {@link com.qcmmanager.domain.Qcm} entity.
 */
public class QcmDTO implements Serializable {

    private Long id;

    @Lob
    private byte[] subject;

    private String subjectContentType;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte[] getSubject() {
        return subject;
    }

    public void setSubject(byte[] subject) {
        this.subject = subject;
    }

    public String getSubjectContentType() {
        return subjectContentType;
    }

    public void setSubjectContentType(String subjectContentType) {
        this.subjectContentType = subjectContentType;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof QcmDTO)) {
            return false;
        }

        QcmDTO qcmDTO = (QcmDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, qcmDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "QcmDTO{" +
            "id=" + getId() +
            ", subject='" + getSubject() + "'" +
            "}";
    }
}
