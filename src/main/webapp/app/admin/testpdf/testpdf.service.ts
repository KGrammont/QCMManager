import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Injectable({
  providedIn: 'root',
})
export class TestpdfService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  findPdf(): Observable<Blob> {
    return this.http.get('api/qcm/testpdf', { responseType: 'blob' });
  }
}
