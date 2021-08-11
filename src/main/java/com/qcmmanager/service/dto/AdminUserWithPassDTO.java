package com.qcmmanager.service.dto;

import com.qcmmanager.domain.User;

public class AdminUserWithPassDTO extends AdminUserDTO {

    private String pass;

    public AdminUserWithPassDTO() {}

    public AdminUserWithPassDTO(User user, String pass) {
        super(user);
        this.pass = pass;
    }

    public String getPass() {
        return pass;
    }

    public void setPass(String pass) {
        this.pass = pass;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AdminUserWithPassDTO{" +
            "login='" + getLogin() + '\'' +
            ", firstName='" + getFirstName() + '\'' +
            ", lastName='" + getLastName() + '\'' +
            ", email='" + getEmail() + '\'' +
            ", imageUrl='" + getImageUrl() + '\'' +
            ", activated=" + isActivated() +
            ", langKey='" + getLangKey() + '\'' +
            ", createdBy=" + getCreatedBy() +
            ", createdDate=" + getCreatedDate() +
            ", lastModifiedBy='" + getLastModifiedBy() + '\'' +
            ", lastModifiedDate=" + getLastModifiedDate() +
            ", authorities=" + getAuthorities() +
            ", pass='" + pass + '\'' +
            '}';
    }
}
