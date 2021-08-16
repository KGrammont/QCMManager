package com.qcmmanager.service.dto;

import com.qcmmanager.service.pdf.Checkbox;
import java.io.Serializable;
import java.util.List;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

public class CompleteQcmPatch implements Serializable {

    @NotNull
    private String name;

    @NotEmpty
    private List<Checkbox> checkboxes;

    public CompleteQcmPatch() {}

    public CompleteQcmPatch(String name, List<Checkbox> checkboxes) {
        this.name = name;
        this.checkboxes = checkboxes;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Checkbox> getCheckboxes() {
        return checkboxes;
    }

    public void setCheckboxes(List<Checkbox> checkboxes) {
        this.checkboxes = checkboxes;
    }
}
