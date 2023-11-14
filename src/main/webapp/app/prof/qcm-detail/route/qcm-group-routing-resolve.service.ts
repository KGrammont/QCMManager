import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IQcmGroup, QcmGroup } from 'app/entities/qcm-group/qcm-group.model';
import { QcmGlobalService } from 'app/prof/qcm-global/service/qcm-global.service';

@Injectable({ providedIn: 'root' })
export class QcmGroupRoutingResolveService  {
  constructor(protected service: QcmGlobalService, protected router: Router) {}

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
