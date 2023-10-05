import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IQcm, getQcmIdentifier } from '../../../entities/qcm/qcm.model';
import { ICompleteQcmPatch } from 'app/shared/pdf/pdf.model';

export type EntityResponseType = HttpResponse<IQcm>;
export type EntityArrayResponseType = HttpResponse<IQcm[]>;

@Injectable({ providedIn: 'root' })
export class QcmDetailService {
  public resourceUrl: string;
  public profResourceUrl: string;

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/qcms');
    this.profResourceUrl = this.applicationConfigService.getEndpointFor('api/qcms/of-group');
  }

  create(qcm: IQcm): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(qcm);
    return this.http
      .post<IQcm>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(qcm: IQcm): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(qcm);
    return this.http
      .put<IQcm>(`${this.resourceUrl}/${getQcmIdentifier(qcm) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(qcm: IQcm): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(qcm);
    return this.http
      .patch<IQcm>(`${this.resourceUrl}/${getQcmIdentifier(qcm) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  completePdf(completeQcmPatch: ICompleteQcmPatch): Observable<EntityResponseType> {
    return this.http
      .patch<ICompleteQcmPatch>(`${this.resourceUrl}/${completeQcmPatch.id}/complete`, completeQcmPatch, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IQcm>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(qcmGroupId: number, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IQcm[]>(`${this.profResourceUrl}/${qcmGroupId}`, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  addQcmToCollectionIfMissing(qcmCollection: IQcm[], ...qcmsToCheck: (IQcm | null | undefined)[]): IQcm[] {
    const qcms: IQcm[] = qcmsToCheck.filter(isPresent);
    if (qcms.length > 0) {
      const qcmCollectionIdentifiers = qcmCollection.map(qcmItem => getQcmIdentifier(qcmItem)!);
      const qcmsToAdd = qcms.filter(qcmItem => {
        const qcmIdentifier = getQcmIdentifier(qcmItem);
        if (qcmIdentifier == null || qcmCollectionIdentifiers.includes(qcmIdentifier)) {
          return false;
        }
        qcmCollectionIdentifiers.push(qcmIdentifier);
        return true;
      });
      return [...qcmsToAdd, ...qcmCollection];
    }
    return qcmCollection;
  }

  protected convertDateFromClient(qcm: IQcm): IQcm {
    return Object.assign({}, qcm, {
      created_at: qcm.createdAt?.isValid() ? qcm.createdAt.toJSON() : undefined,
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
      res.body.forEach((qcm: IQcm) => {
        qcm.createdAt = qcm.createdAt ? dayjs(qcm.createdAt) : undefined;
      });
    }
    return res;
  }
}
