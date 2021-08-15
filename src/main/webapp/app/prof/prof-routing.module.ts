import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Authority } from 'app/config/authority.constants';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'user-management',
        data: {
          pageTitle: 'Elèves',
          authorities: [Authority.ADMIN, Authority.PROF],
        },
        loadChildren: () => import('./student-management/student-management.module').then(m => m.StudentManagementModule),
      },
      {
        path: 'qcm-global',
        data: {
          pageTitle: 'Qcm: vue globale',
          authorities: [Authority.ADMIN, Authority.PROF],
        },
        loadChildren: () => import('./qcm-global/qcm-global.module').then(m => m.QcmGlobalModule),
      },
    ]),
  ],
})
export class ProfRoutingModule {}
