import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IQcmGroup, getQcmGroupIdentifier } from '../qcm-group.model';

export type EntityResponseType = HttpResponse<IQcmGroup>;
export type EntityArrayResponseType = HttpResponse<IQcmGroup[]>;

@Injectable({ providedIn: 'root' })
export class QcmGroupService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/qcm-groups');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(qcmGroup: IQcmGroup): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(qcmGroup);
    return this.http
      .post<IQcmGroup>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(qcmGroup: IQcmGroup): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(qcmGroup);
    return this.http
      .put<IQcmGroup>(`${this.resourceUrl}/${getQcmGroupIdentifier(qcmGroup) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(qcmGroup: IQcmGroup): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(qcmGroup);
    return this.http
      .patch<IQcmGroup>(`${this.resourceUrl}/${getQcmGroupIdentifier(qcmGroup) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IQcmGroup>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IQcmGroup[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addQcmGroupToCollectionIfMissing(qcmGroupCollection: IQcmGroup[], ...qcmGroupsToCheck: (IQcmGroup | null | undefined)[]): IQcmGroup[] {
    const qcmGroups: IQcmGroup[] = qcmGroupsToCheck.filter(isPresent);
    if (qcmGroups.length > 0) {
      const qcmGroupCollectionIdentifiers = qcmGroupCollection.map(qcmGroupItem => getQcmGroupIdentifier(qcmGroupItem)!);
      const qcmGroupsToAdd = qcmGroups.filter(qcmGroupItem => {
        const qcmGroupIdentifier = getQcmGroupIdentifier(qcmGroupItem);
        if (qcmGroupIdentifier == null || qcmGroupCollectionIdentifiers.includes(qcmGroupIdentifier)) {
          return false;
        }
        qcmGroupCollectionIdentifiers.push(qcmGroupIdentifier);
        return true;
      });
      return [...qcmGroupsToAdd, ...qcmGroupCollection];
    }
    return qcmGroupCollection;
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
