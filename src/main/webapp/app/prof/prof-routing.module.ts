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
      {
        path: 'qcm-detail',
        data: {
          pageTitle: 'Qcm: vue détaillée',
          authorities: [Authority.ADMIN, Authority.PROF],
        },
        loadChildren: () => import('./qcm-detail/qcm-detail.module').then(m => m.QcmDetailModule),
      },
    ]),
  ],
})
export class ProfRoutingModule {}
