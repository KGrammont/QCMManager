import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { QcmGroupComponent } from '../list/qcm-group.component';
import { QcmGroupDetailComponent } from '../detail/qcm-group-detail.component';
import { QcmGroupUpdateComponent } from '../update/qcm-group-update.component';
import { QcmGroupRoutingResolveService } from './qcm-group-routing-resolve.service';

const qcmGroupRoute: Routes = [
  {
    path: '',
    component: QcmGroupComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: QcmGroupDetailComponent,
    resolve: {
      qcmGroup: QcmGroupRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: QcmGroupUpdateComponent,
    resolve: {
      qcmGroup: QcmGroupRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: QcmGroupUpdateComponent,
    resolve: {
      qcmGroup: QcmGroupRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(qcmGroupRoute)],
  exports: [RouterModule],
})
export class QcmGroupRoutingModule {}
