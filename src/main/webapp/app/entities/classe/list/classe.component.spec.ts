import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
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
      })
        .overrideTemplate(ClasseComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ClasseComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ClasseService);

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
      expect(comp.classes?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
