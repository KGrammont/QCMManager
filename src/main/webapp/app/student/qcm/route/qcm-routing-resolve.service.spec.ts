jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IQcm, Qcm } from '../qcm.model';
import { QcmService } from '../service/qcm.service';

import { QcmRoutingResolveService } from './qcm-routing-resolve.service';

describe('Service Tests', () => {
  describe('Qcm routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: QcmRoutingResolveService;
    let service: QcmService;
    let resultQcm: IQcm | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(QcmRoutingResolveService);
      service = TestBed.inject(QcmService);
      resultQcm = undefined;
    });

    describe('resolve', () => {
      it('should return IQcm returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultQcm = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultQcm).toEqual({ id: 123 });
      });

      it('should return new IQcm if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultQcm = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultQcm).toEqual(new Qcm());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultQcm = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultQcm).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
