import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { QcmGroupService } from '../service/qcm-group.service';

import { QcmGroupComponent } from './qcm-group.component';

describe('Component Tests', () => {
  describe('QcmGroup Management Component', () => {
    let comp: QcmGroupComponent;
    let fixture: ComponentFixture<QcmGroupComponent>;
    let service: QcmGroupService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [QcmGroupComponent],
      })
        .overrideTemplate(QcmGroupComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(QcmGroupComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(QcmGroupService);

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
