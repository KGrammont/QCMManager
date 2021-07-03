package com.qcmmanager.domain;

import java.io.Serializable;
import javax.persistence.*;

/**
 * A Qcm.
 */
@Entity
@Table(name = "qcm")
public class Qcm implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(name = "subject")
    private byte[] subject;

    @Column(name = "subject_content_type")
    private String subjectContentType;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Qcm id(Long id) {
        this.id = id;
        return this;
    }

    public byte[] getSubject() {
        return this.subject;
    }

    public Qcm subject(byte[] subject) {
        this.subject = subject;
        return this;
    }

    public void setSubject(byte[] subject) {
        this.subject = subject;
    }

    public String getSubjectContentType() {
        return this.subjectContentType;
    }

    public Qcm subjectContentType(String subjectContentType) {
        this.subjectContentType = subjectContentType;
        return this;
    }

    public void setSubjectContentType(String subjectContentType) {
        this.subjectContentType = subjectContentType;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Qcm)) {
            return false;
        }
        return id != null && id.equals(((Qcm) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Qcm{" +
            "id=" + getId() +
            ", subject='" + getSubject() + "'" +
            ", subjectContentType='" + getSubjectContentType() + "'" +
            "}";
    }
}
