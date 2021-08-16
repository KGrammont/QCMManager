import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'qcm',
        loadChildren: () => import('./qcm/qcm.module').then(m => m.QcmModule),
        data: {
          pageTitle: 'Qcm',
        },
      },
    ]),
  ],
})
export class StudentRoutingModule {}
