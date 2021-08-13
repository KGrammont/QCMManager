import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { StudentManagementComponent } from './list/student-management.component';
import { StudentManagementUpdateComponent } from './update/student-management-update.component';
import { StudentManagementMassiveCreateComponent } from './massivecreate/student-management-massivecreate.component';
import { StudentManagementDeleteDialogComponent } from './delete/student-management-delete-dialog.component';
import { userManagementRoute } from './student-management.route';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(userManagementRoute)],
  declarations: [
    StudentManagementComponent,
    StudentManagementUpdateComponent,
    StudentManagementDeleteDialogComponent,
    StudentManagementMassiveCreateComponent,
  ],
  entryComponents: [StudentManagementDeleteDialogComponent],
})
export class StudentManagementModule {}
