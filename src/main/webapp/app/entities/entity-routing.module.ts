import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Authority } from 'app/config/authority.constants';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'classe',
        data: {
          pageTitle: 'Classes',
          authorities: [Authority.ADMIN, Authority.PROF],
        },
        loadChildren: () => import('./classe/classe.module').then(m => m.ClasseModule),
      },
      {
        path: 'qcm-group',
        data: {
          pageTitle: 'Groupe de Qcms',
          authorities: [Authority.ADMIN, Authority.PROF],
        },
        loadChildren: () => import('./qcm-group/qcm-group.module').then(m => m.QcmGroupModule),
      },
      {
        path: 'qcm',
        data: {
          pageTitle: 'Qcms',
          authorities: [Authority.ADMIN],
        },
        loadChildren: () => import('./qcm/qcm.module').then(m => m.QcmModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
