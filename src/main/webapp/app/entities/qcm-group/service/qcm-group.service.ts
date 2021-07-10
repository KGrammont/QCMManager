import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IQcmGroup, getQcmGroupIdentifier } from '../qcm-group.model';

export type EntityResponseType = HttpResponse<IQcmGroup>;
export type EntityArrayResponseType = HttpResponse<IQcmGroup[]>;

@Injectable({ providedIn: 'root' })
export class QcmGroupService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/qcm-groups');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(qcmGroup: IQcmGroup): Observable<EntityResponseType> {
    return this.http.post<IQcmGroup>(this.resourceUrl, qcmGroup, { observe: 'response' });
  }

  update(qcmGroup: IQcmGroup): Observable<EntityResponseType> {
    return this.http.put<IQcmGroup>(`${this.resourceUrl}/${getQcmGroupIdentifier(qcmGroup) as number}`, qcmGroup, { observe: 'response' });
  }

  partialUpdate(qcmGroup: IQcmGroup): Observable<EntityResponseType> {
    return this.http.patch<IQcmGroup>(`${this.resourceUrl}/${getQcmGroupIdentifier(qcmGroup) as number}`, qcmGroup, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IQcmGroup>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IQcmGroup[]>(this.resourceUrl, { params: options, observe: 'response' });
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
}
