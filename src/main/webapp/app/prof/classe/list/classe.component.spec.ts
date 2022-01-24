jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { ClasseService } from '../service/classe.service';

import { ClasseComponent } from './classe.component';

describe('Component Tests', () => {
  describe('Classe Management Component', () => {
    let comp: ClasseComponent;
    let fixture: ComponentFixture<ClasseComponent>;
    let service: ClasseService;

    beforeEach(() => {
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
        ],
      })
        .overrideTemplate(ClasseComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ClasseComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ClasseService);
    });

    it('Should call load classe of current prof on init', () => {
      // GIVEN
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
      expect(service.queryForProf).toHaveBeenCalled();
      expect(comp.classes?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });

    it('should load a page', () => {
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
  });
});
