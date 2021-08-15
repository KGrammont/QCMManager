import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IQcmGroup } from '../qcm-group.model';

export type EntityResponseType = HttpResponse<IQcmGroup>;
export type EntityArrayResponseType = HttpResponse<IQcmGroup[]>;

@Injectable({ providedIn: 'root' })
export class QcmGlobalService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/qcm-groups');
  public currentProfResourceUrl = this.applicationConfigService.getEndpointFor('api/qcm-groups/of-current-prof');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(qcmGroup: IQcmGroup): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(qcmGroup);
    return this.http
      .post<IQcmGroup>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IQcmGroup[]>(this.currentProfResourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(qcmGroup: IQcmGroup): IQcmGroup {
    return Object.assign({}, qcmGroup, {
      created_at: qcmGroup.created_at?.isValid() ? qcmGroup.created_at.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.created_at = res.body.created_at ? dayjs(res.body.created_at) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((qcmGroup: IQcmGroup) => {
        qcmGroup.created_at = qcmGroup.created_at ? dayjs(qcmGroup.created_at) : undefined;
      });
    }
    return res;
  }
}
