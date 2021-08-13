package com.qcmmanager.web.rest.vm;

import java.io.Serializable;

public class UserCreationFeedback implements Serializable {

    private String email;
    private Boolean hasBeenCreated;
    private String reason;

    public UserCreationFeedback() {}

    public UserCreationFeedback(String email, Boolean hasBeenCreated, String reason) {
        this.email = email;
        this.hasBeenCreated = hasBeenCreated;
        this.reason = reason;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getHasBeenCreated() {
        return hasBeenCreated;
    }

    public void setHasBeenCreated(Boolean hasBeenCreated) {
        this.hasBeenCreated = hasBeenCreated;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
