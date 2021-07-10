jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IClasse, Classe } from '../classe.model';
import { ClasseService } from '../service/classe.service';

import { ClasseRoutingResolveService } from './classe-routing-resolve.service';

describe('Service Tests', () => {
  describe('Classe routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ClasseRoutingResolveService;
    let service: ClasseService;
    let resultClasse: IClasse | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ClasseRoutingResolveService);
      service = TestBed.inject(ClasseService);
      resultClasse = undefined;
    });

    describe('resolve', () => {
      it('should return IClasse returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultClasse = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultClasse).toEqual({ id: 123 });
      });

      it('should return new IClasse if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultClasse = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultClasse).toEqual(new Classe());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultClasse = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultClasse).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
