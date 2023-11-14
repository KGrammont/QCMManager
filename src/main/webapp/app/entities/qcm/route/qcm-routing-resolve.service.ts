import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IQcm, Qcm } from '../qcm.model';
import { QcmService } from '../service/qcm.service';

@Injectable({ providedIn: 'root' })
export class QcmRoutingResolveService  {
  constructor(protected service: QcmService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IQcm> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((qcm: HttpResponse<Qcm>) => {
          if (qcm.body) {
            return of(qcm.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Qcm());
  }
}
