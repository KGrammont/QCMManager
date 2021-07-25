import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'classe',
        data: { pageTitle: 'Classes' },
        loadChildren: () => import('./classe/classe.module').then(m => m.ClasseModule),
      },
      {
        path: 'qcm-group',
        data: { pageTitle: 'QcmGroups' },
        loadChildren: () => import('./qcm-group/qcm-group.module').then(m => m.QcmGroupModule),
      },
      {
        path: 'qcm',
        data: { pageTitle: 'Qcms' },
        loadChildren: () => import('./qcm/qcm.module').then(m => m.QcmModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
