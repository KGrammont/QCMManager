import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'user-management',
        loadChildren: () => import('./student-management/student-management.module').then(m => m.StudentManagementModule),
        data: {
          pageTitle: 'Utilisateurs',
        },
      },
    ]),
  ],
})
export class ProfRoutingModule {}
