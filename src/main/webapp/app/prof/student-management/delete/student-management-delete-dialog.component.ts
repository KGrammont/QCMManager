import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { User } from '../student-management.model';
import { StudentManagementService } from '../service/student-management.service';

@Component({
  selector: 'jhi-user-mgmt-delete-dialog',
  templateUrl: './student-management-delete-dialog.component.html',
})
export class StudentManagementDeleteDialogComponent {
  user?: User;

  constructor(private userService: StudentManagementService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(login: string): void {
    this.userService.delete(login).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
