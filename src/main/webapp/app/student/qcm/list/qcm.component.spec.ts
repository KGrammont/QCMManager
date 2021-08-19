jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { QcmService } from '../service/qcm.service';

import { QcmComponent } from './qcm.component';
import { ActivatedRoute, Router } from '@angular/router';

describe('Component Tests', () => {
  describe('Qcm Management Component', () => {
    let comp: QcmComponent;
    let fixture: ComponentFixture<QcmComponent>;
    let service: QcmService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [QcmComponent],
        providers: [
          Router,
          {
            provide: ActivatedRoute,
            useValue: {
              queryParamMap: of(
                jest.requireActual('@angular/router').convertToParamMap({
                  page: '1',
                  size: '1',
                  sort: ['createdAt,desc', 'id'],
                })
              ),
            },
          },
        ],
      })
        .overrideTemplate(QcmComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(QcmComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(QcmService);

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

    it('should load a page', () => {
      // WHEN
      comp.loadPage(1);

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.qcms?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });

    it('should sort by createdAt', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalledWith(expect.objectContaining({ sort: ['createdAt,desc', 'id'] }));
    });
  });
});
