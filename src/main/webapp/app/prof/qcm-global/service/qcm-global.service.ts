import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICompleteQcmGroup } from '../qcm-group.model';
import { IQcmGroup } from 'app/entities/qcm-group/qcm-group.model';

export type EntityResponseType = HttpResponse<ICompleteQcmGroup>;
export type EntityArrayResponseType = HttpResponse<ICompleteQcmGroup[]>;

@Injectable({ providedIn: 'root' })
export class QcmGlobalService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/qcm-groups');
  public distributeResourceUrl = this.applicationConfigService.getEndpointFor('api/qcm-groups/distribute');
  public currentProfResourceUrl = this.applicationConfigService.getEndpointFor('api/qcm-groups/of-current-prof');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(qcmGroup: ICompleteQcmGroup): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(qcmGroup);
    return this.http
      .post<ICompleteQcmGroup>(this.distributeResourceUrl, copy, { observe: 'response' })
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

  protected convertDateFromClient(qcmGroup: ICompleteQcmGroup): ICompleteQcmGroup {
    return Object.assign({}, qcmGroup, {
      created_at: qcmGroup.createdAt?.isValid() ? qcmGroup.createdAt.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.createdAt = res.body.createdAt ? dayjs(res.body.createdAt) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((qcmGroup: IQcmGroup) => {
        qcmGroup.createdAt = qcmGroup.createdAt ? dayjs(qcmGroup.createdAt) : undefined;
      });
    }
    return res;
  }
}
