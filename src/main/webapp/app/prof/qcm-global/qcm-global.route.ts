import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { QcmGlobalComponent } from './list/qcm-global.component';
import { QcmGlobalCreateComponent } from './create/qcm-global-create.component';

export const qcmGlobalRoute: Routes = [
  {
    path: '',
    component: QcmGlobalComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: QcmGlobalCreateComponent,
    canActivate: [UserRouteAccessService],
  },
];
