import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IQcm, getQcmIdentifier } from '../qcm.model';

export type EntityResponseType = HttpResponse<IQcm>;
export type EntityArrayResponseType = HttpResponse<IQcm[]>;

@Injectable({ providedIn: 'root' })
export class QcmService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/qcms');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

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

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IQcm>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IQcm[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
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
      created_at: qcm.created_at?.isValid() ? qcm.created_at.toJSON() : undefined,
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
      res.body.forEach((qcm: IQcm) => {
        qcm.created_at = qcm.created_at ? dayjs(qcm.created_at) : undefined;
      });
    }
    return res;
  }
}
