import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { QcmDetailComponent } from '../list/qcm-detail.component';
import { QcmDetailUpdateComponent } from '../update/qcm-detail-update.component';
import { QcmDetailRoutingResolveService } from './qcm-detail-routing-resolve.service';

const qcmRoute: Routes = [
  {
    path: '',
    component: QcmDetailComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: QcmDetailUpdateComponent,
    resolve: {
      qcm: QcmDetailRoutingResolveService,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(qcmRoute)],
  exports: [RouterModule],
})
export class QcmDetailRoutingModule {}
