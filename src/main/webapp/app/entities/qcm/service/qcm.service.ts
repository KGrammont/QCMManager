import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IQcm, getQcmIdentifier } from '../qcm.model';

export type EntityResponseType = HttpResponse<IQcm>;
export type EntityArrayResponseType = HttpResponse<IQcm[]>;

@Injectable({ providedIn: 'root' })
export class QcmService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/qcms');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(qcm: IQcm): Observable<EntityResponseType> {
    return this.http.post<IQcm>(this.resourceUrl, qcm, { observe: 'response' });
  }

  update(qcm: IQcm): Observable<EntityResponseType> {
    return this.http.put<IQcm>(`${this.resourceUrl}/${getQcmIdentifier(qcm) as number}`, qcm, { observe: 'response' });
  }

  partialUpdate(qcm: IQcm): Observable<EntityResponseType> {
    return this.http.patch<IQcm>(`${this.resourceUrl}/${getQcmIdentifier(qcm) as number}`, qcm, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IQcm>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IQcm[]>(this.resourceUrl, { params: options, observe: 'response' });
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
}
