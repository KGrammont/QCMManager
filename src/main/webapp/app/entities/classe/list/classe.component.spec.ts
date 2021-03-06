jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { ClasseService } from '../service/classe.service';

import { ClasseComponent } from './classe.component';
import { AccountService } from 'app/core/auth/account.service';
import { Authority } from 'app/config/authority.constants';

describe('Component Tests', () => {
  describe('Classe Management Component', () => {
    let comp: ClasseComponent;
    let fixture: ComponentFixture<ClasseComponent>;
    let service: ClasseService;
    const accountService = { hasAnyAuthority: jest.fn(() => true) };

    beforeEach(() => {
      TestBed.overrideProvider(AccountService, { useValue: accountService });
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ClasseComponent],
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
                  sort: 'id,desc',
                })
              ),
            },
          },
          AccountService,
        ],
      })
        .overrideTemplate(ClasseComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ClasseComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ClasseService);
    });

    it('Should call load all when ADMIN on init', () => {
      spyOn(accountService, 'hasAnyAuthority').and.returnValue(true);
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(accountService.hasAnyAuthority).toHaveBeenCalledWith(Authority.ADMIN);
      expect(service.query).toHaveBeenCalled();
      expect(comp.classes?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });

    it('Should call load classe of current prof when not ADMIN on init', () => {
      // GIVEN
      spyOn(accountService, 'hasAnyAuthority').and.returnValue(false);
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'queryForProf').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(accountService.hasAnyAuthority).toHaveBeenCalledWith(Authority.ADMIN);
      expect(service.queryForProf).toHaveBeenCalled();
      expect(comp.classes?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });

    it('should load a page when ADMIN', () => {
      comp.hasAdminAuthority = true;
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );

      // WHEN
      comp.loadPage(1);

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.classes?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });

    it('should load a page when not ADMIN', () => {
      comp.hasAdminAuthority = false;
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'queryForProf').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );

      // WHEN
      comp.loadPage(1);

      // THEN
      expect(service.queryForProf).toHaveBeenCalled();
      expect(comp.classes?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });

    it('should calculate the sort attribute for an id', () => {
      // WHEN
      spyOn(accountService, 'hasAnyAuthority').and.returnValue(true);
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalledWith(expect.objectContaining({ sort: ['id,desc'] }));
    });

    it('should calculate the sort attribute for a non-id attribute', () => {
      // INIT
      spyOn(accountService, 'hasAnyAuthority').and.returnValue(true);
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
      comp.ngOnInit();

      // GIVEN
      comp.predicate = 'name';

      // WHEN
      comp.loadPage(1);

      // THEN
      expect(service.query).toHaveBeenLastCalledWith(expect.objectContaining({ sort: ['name,desc', 'id'] }));
    });
  });
});
