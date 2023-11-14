import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IQcmGroup, QcmGroup } from '../qcm-group.model';
import { QcmGroupService } from '../service/qcm-group.service';

@Injectable({ providedIn: 'root' })
export class QcmGroupRoutingResolveService  {
  constructor(protected service: QcmGroupService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IQcmGroup> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((qcmGroup: HttpResponse<QcmGroup>) => {
          if (qcmGroup.body) {
            return of(qcmGroup.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new QcmGroup());
  }
}
