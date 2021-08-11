import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { QcmComponent } from '../list/qcm.component';
import { QcmDetailComponent } from '../detail/qcm-detail.component';
import { QcmUpdateComponent } from '../update/qcm-update.component';
import { QcmRoutingResolveService } from './qcm-routing-resolve.service';
import { Authority } from 'app/config/authority.constants';

const qcmRoute: Routes = [
  {
    path: '',
    component: QcmComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: QcmDetailComponent,
    data: {
      authorities: [Authority.ADMIN, Authority.PROF],
    },
    resolve: {
      qcm: QcmRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: QcmUpdateComponent,
    data: {
      authorities: [Authority.ADMIN, Authority.PROF],
    },
    resolve: {
      qcm: QcmRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: QcmUpdateComponent,
    data: {
      authorities: [Authority.ADMIN, Authority.PROF],
    },
    resolve: {
      qcm: QcmRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(qcmRoute)],
  exports: [RouterModule],
})
export class QcmRoutingModule {}
