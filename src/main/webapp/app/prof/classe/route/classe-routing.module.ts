import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ClasseComponent } from '../list/classe.component';
import { ClasseUpdateComponent } from '../update/classe-update.component';
import { ClasseRoutingResolveService } from '../../../entities/classe/route/classe-routing-resolve.service';

const classeRoute: Routes = [
  {
    path: '',
    component: ClasseComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ClasseUpdateComponent,
    resolve: {
      classe: ClasseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ClasseUpdateComponent,
    resolve: {
      classe: ClasseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(classeRoute)],
  exports: [RouterModule],
})
export class ClasseRoutingModule {}
