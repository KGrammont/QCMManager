import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { QcmComponent } from '../list/qcm.component';
import { QcmDetailComponent } from '../detail/qcm-detail.component';
import { QcmUpdateComponent } from '../update/qcm-update.component';
import { QcmRoutingResolveService } from './qcm-routing-resolve.service';

const qcmRoute: Routes = [
  {
    path: '',
    component: QcmComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: QcmDetailComponent,
    resolve: {
      qcm: QcmRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: QcmUpdateComponent,
    resolve: {
      qcm: QcmRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: QcmUpdateComponent,
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
