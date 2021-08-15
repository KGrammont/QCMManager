import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { QcmGlobalService } from '../service/qcm-global.service';

import { QcmGlobalComponent } from './qcm-global.component';

describe('Component Tests', () => {
  describe('QcmGroup Management Component', () => {
    let comp: QcmGlobalComponent;
    let fixture: ComponentFixture<QcmGlobalComponent>;
    let service: QcmGlobalService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [QcmGlobalComponent],
      })
        .overrideTemplate(QcmGlobalComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(QcmGlobalComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(QcmGlobalService);

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
      expect(comp.qcmGroups?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
