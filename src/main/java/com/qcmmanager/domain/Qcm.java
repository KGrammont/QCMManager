package com.qcmmanager.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;

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
    @Column(name = "question", nullable = false)
    private byte[] question;

    @Column(name = "question_content_type", nullable = false)
    private String questionContentType;

    @Lob
    @Column(name = "answer")
    private byte[] answer;

    @Column(name = "answer_content_type")
    private String answerContentType;

    @Lob
    @Column(name = "complete_answer")
    private byte[] completeAnswer;

    @Column(name = "complete_answer_content_type")
    private String completeAnswerContentType;

    @Lob
    @Column(name = "correction")
    private byte[] correction;

    @Column(name = "correction_content_type")
    private String correctionContentType;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "classe" }, allowSetters = true)
    private QcmGroup qcmGroup;

    @ManyToOne(optional = false)
    @NotNull
    private User student;

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

    public byte[] getQuestion() {
        return this.question;
    }

    public Qcm question(byte[] question) {
        this.question = question;
        return this;
    }

    public void setQuestion(byte[] question) {
        this.question = question;
    }

    public String getQuestionContentType() {
        return this.questionContentType;
    }

    public Qcm questionContentType(String questionContentType) {
        this.questionContentType = questionContentType;
        return this;
    }

    public void setQuestionContentType(String questionContentType) {
        this.questionContentType = questionContentType;
    }

    public byte[] getAnswer() {
        return this.answer;
    }

    public Qcm answer(byte[] answer) {
        this.answer = answer;
        return this;
    }

    public void setAnswer(byte[] answer) {
        this.answer = answer;
    }

    public String getAnswerContentType() {
        return this.answerContentType;
    }

    public Qcm answerContentType(String answerContentType) {
        this.answerContentType = answerContentType;
        return this;
    }

    public void setAnswerContentType(String answerContentType) {
        this.answerContentType = answerContentType;
    }

    public byte[] getCompleteAnswer() {
        return this.completeAnswer;
    }

    public Qcm completeAnswer(byte[] completeAnswer) {
        this.completeAnswer = completeAnswer;
        return this;
    }

    public void setCompleteAnswer(byte[] completeAnswer) {
        this.completeAnswer = completeAnswer;
    }

    public String getCompleteAnswerContentType() {
        return this.completeAnswerContentType;
    }

    public Qcm completeAnswerContentType(String completeAnswerContentType) {
        this.completeAnswerContentType = completeAnswerContentType;
        return this;
    }

    public void setCompleteAnswerContentType(String completeAnswerContentType) {
        this.completeAnswerContentType = completeAnswerContentType;
    }

    public byte[] getCorrection() {
        return this.correction;
    }

    public Qcm correction(byte[] correction) {
        this.correction = correction;
        return this;
    }

    public void setCorrection(byte[] correction) {
        this.correction = correction;
    }

    public String getCorrectionContentType() {
        return this.correctionContentType;
    }

    public Qcm correctionContentType(String correctionContentType) {
        this.correctionContentType = correctionContentType;
        return this;
    }

    public void setCorrectionContentType(String correctionContentType) {
        this.correctionContentType = correctionContentType;
    }

    public QcmGroup getQcmGroup() {
        return this.qcmGroup;
    }

    public Qcm qcmGroup(QcmGroup qcmGroup) {
        this.setQcmGroup(qcmGroup);
        return this;
    }

    public void setQcmGroup(QcmGroup qcmGroup) {
        this.qcmGroup = qcmGroup;
    }

    public User getStudent() {
        return this.student;
    }

    public Qcm student(User user) {
        this.setStudent(user);
        return this;
    }

    public void setStudent(User user) {
        this.student = user;
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
            ", question='" + getQuestion() + "'" +
            ", questionContentType='" + getQuestionContentType() + "'" +
            ", answer='" + getAnswer() + "'" +
            ", answerContentType='" + getAnswerContentType() + "'" +
            ", completeAnswer='" + getCompleteAnswer() + "'" +
            ", completeAnswerContentType='" + getCompleteAnswerContentType() + "'" +
            ", correction='" + getCorrection() + "'" +
            ", correctionContentType='" + getCorrectionContentType() + "'" +
            "}";
    }
}
