jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { QcmGlobalService } from '../service/qcm-global.service';

import { QcmGlobalComponent } from './qcm-global.component';
import { ActivatedRoute, Router } from '@angular/router';

describe('Component Tests', () => {
  describe('QcmGroup Management Component', () => {
    let comp: QcmGlobalComponent;
    let fixture: ComponentFixture<QcmGlobalComponent>;
    let service: QcmGlobalService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [QcmGlobalComponent],
        providers: [
          Router,
          {
            provide: ActivatedRoute,
            useValue: {
              data: of({
                defaultSort: 'id,asc',
              }),
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

    it('should load a page', () => {
      // WHEN
      comp.loadPage(1);

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.qcmGroups?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });

    it('should sort by createdAt', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalledWith(expect.objectContaining({ sort: ['createdAt,desc', 'id'] }));
    });
  });
});
