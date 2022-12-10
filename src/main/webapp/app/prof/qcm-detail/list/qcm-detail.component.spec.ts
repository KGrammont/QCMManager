jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { QcmDetailService } from '../service/qcm-detail.service';

import { QcmDetailComponent } from './qcm-detail.component';
import { QcmGlobalService } from 'app/prof/qcm-global/service/qcm-global.service';
import { IQcmGroup, QcmGroup } from 'app/entities/qcm-group/qcm-group.model';

describe('Component Tests', () => {
  describe('Qcm Detail Management Component', () => {
    let comp: QcmDetailComponent;
    let fixture: ComponentFixture<QcmDetailComponent>;
    let service: QcmDetailService;
    let globalService: QcmGlobalService;
    let activatedRoute: ActivatedRoute;
    let router: Router;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [QcmDetailComponent],
        providers: [
          Router,
          {
            provide: ActivatedRoute,
            useValue: {
              queryParamMap: of(
                jest.requireActual('@angular/router').convertToParamMap({
                  page: '1',
                  size: '1',
                  sort: ['created_at,desc', 'id'],
                })
              ),
            },
          },
        ],
      })
        .overrideTemplate(QcmDetailComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(QcmDetailComponent);
      service = TestBed.inject(QcmDetailService);
      globalService = TestBed.inject(QcmGlobalService);
      activatedRoute = TestBed.inject(ActivatedRoute);
      router = TestBed.inject(Router);
      comp = fixture.componentInstance;

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
      spyOn(globalService, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 1234 }, { id: 456 }],
            headers,
          })
        )
      );
    });

    it('Should call load all qcmGroup and all qcms of selected on init', () => {
      // WHEN
      const qcmGroup: IQcmGroup = { id: 456 };
      activatedRoute.data = of({ qcmGroup });
      comp.ngOnInit();

      // THEN
      expect(globalService.query).toHaveBeenCalled();
      expect(service.query).toHaveBeenCalledWith(qcmGroup.id, expect.objectContaining({ sort: ['created_at,desc', 'id'] }));
      expect(comp.qcms).toEqual(jasmine.arrayContaining([{ id: 123 }]));
      expect(comp.allQcmGroups).toEqual(jasmine.arrayContaining([{ id: 1234 }, { id: 456 }]));
      expect(comp.selectedQcmGroup).toEqual(qcmGroup);
      expect(router.navigate).toHaveBeenCalledTimes(0);
    });

    it('Should call load all qcmGroup and all qcms of first when no selected on init', () => {
      // WHEN
      const qcmGroup: IQcmGroup = new QcmGroup();
      const expectedQcmGroup: IQcmGroup = { id: 1234 };
      activatedRoute.data = of({ qcmGroup });
      comp.ngOnInit();

      // THEN
      expect(globalService.query).toHaveBeenCalled();
      expect(service.query).toHaveBeenCalledWith(expectedQcmGroup.id, expect.objectContaining({ sort: ['created_at,desc', 'id'] }));
      expect(comp.qcms).toEqual(jasmine.arrayContaining([{ id: 123 }]));
      expect(comp.allQcmGroups).toEqual(jasmine.arrayContaining([{ id: 1234 }, { id: 456 }]));
      expect(comp.selectedQcmGroup).toEqual(expectedQcmGroup);
      expect(router.navigate).toHaveBeenCalledTimes(0);
    });

    it('should load a page and navigate', () => {
      // WHEN
      comp.selectedQcmGroup = { id: 987 };
      comp.loadPage(1);

      // THEN
      expect(service.query).toHaveBeenCalledWith(987, jasmine.any(Object));
      expect(comp.qcms?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
      expect(router.navigate).toHaveBeenCalled();
    });
  });
});
