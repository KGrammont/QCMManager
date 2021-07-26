package com.qcmmanager.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A QcmGroup.
 */
@Entity
@Table(name = "qcm_group")
public class QcmGroup implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "created_at", nullable = false)
    private Instant created_at;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "prof", "students" }, allowSetters = true)
    private Classe classe;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public QcmGroup id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public QcmGroup name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Instant getCreated_at() {
        return this.created_at;
    }

    public QcmGroup created_at(Instant created_at) {
        this.created_at = created_at;
        return this;
    }

    public void setCreated_at(Instant created_at) {
        this.created_at = created_at;
    }

    public Classe getClasse() {
        return this.classe;
    }

    public QcmGroup classe(Classe classe) {
        this.setClasse(classe);
        return this;
    }

    public void setClasse(Classe classe) {
        this.classe = classe;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof QcmGroup)) {
            return false;
        }
        return id != null && id.equals(((QcmGroup) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "QcmGroup{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", created_at='" + getCreated_at() + "'" +
            "}";
    }
}
