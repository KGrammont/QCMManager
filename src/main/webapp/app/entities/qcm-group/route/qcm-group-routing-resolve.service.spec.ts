jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IQcmGroup, QcmGroup } from '../qcm-group.model';
import { QcmGroupService } from '../service/qcm-group.service';

import { QcmGroupRoutingResolveService } from './qcm-group-routing-resolve.service';

describe('Service Tests', () => {
  describe('QcmGroup routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: QcmGroupRoutingResolveService;
    let service: QcmGroupService;
    let resultQcmGroup: IQcmGroup | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(QcmGroupRoutingResolveService);
      service = TestBed.inject(QcmGroupService);
      resultQcmGroup = undefined;
    });

    describe('resolve', () => {
      it('should return IQcmGroup returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultQcmGroup = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultQcmGroup).toEqual({ id: 123 });
      });

      it('should return new IQcmGroup if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultQcmGroup = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultQcmGroup).toEqual(new QcmGroup());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultQcmGroup = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultQcmGroup).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
