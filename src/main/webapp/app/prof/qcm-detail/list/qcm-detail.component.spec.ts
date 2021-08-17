import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { QcmDetailService } from '../service/qcm-detail.service';

import { QcmDetailComponent } from './qcm-detail.component';

describe('Component Tests', () => {
  describe('Qcm Detail Management Component', () => {
    let comp: QcmDetailComponent;
    let fixture: ComponentFixture<QcmDetailComponent>;
    let service: QcmDetailService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [QcmDetailComponent],
      })
        .overrideTemplate(QcmDetailComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(QcmDetailComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(QcmDetailService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.qcms?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
