import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Pagination } from 'app/core/request/request.model';
import { IUser, IUserCreationFeedback } from '../student-management.model';

@Injectable({ providedIn: 'root' })
export class StudentManagementService {
  public adminResourceUrl: string;
  public studentCreationResourceUrl: string;
  public studentMassiveCreationResourceUrl: string;
  public studentsResourceUrl: string;

  private characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz0123456789';
  private charactersLength = this.characters.length;

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {
    this.adminResourceUrl = this.applicationConfigService.getEndpointFor('api/admin/users');
    this.studentCreationResourceUrl = this.applicationConfigService.getEndpointFor('api/admin/students');
    this.studentMassiveCreationResourceUrl = this.applicationConfigService.getEndpointFor('api/admin/students/multiple');
    this.studentsResourceUrl = this.applicationConfigService.getEndpointFor('api/students');
  }

  create(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(this.studentCreationResourceUrl, user);
  }

  massiveCreate(users: IUser[]): Observable<IUserCreationFeedback[]> {
    return this.http.post<IUserCreationFeedback[]>(this.studentMassiveCreationResourceUrl, users);
  }

  update(user: IUser): Observable<IUser> {
    return this.http.put<IUser>(this.adminResourceUrl, user);
  }

  find(login: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.adminResourceUrl}/${login}`);
  }

  query(req?: Pagination): Observable<HttpResponse<IUser[]>> {
    const options = createRequestOption(req);
    return this.http.get<IUser[]>(this.studentsResourceUrl, { params: options, observe: 'response' });
  }

  delete(login: string): Observable<{}> {
    return this.http.delete(`${this.adminResourceUrl}/${login}`);
  }

  generateRandomPass(): string {
    let pass = '';
    for (let i = 0; i < 4; i++) {
      pass += this.characters.charAt(Math.floor(Math.random() * this.charactersLength));
    }
    return pass;
  }
}
