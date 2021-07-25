jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ClasseService } from '../service/classe.service';
import { IClasse, Classe } from '../classe.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { ClasseUpdateComponent } from './classe-update.component';

describe('Component Tests', () => {
  describe('Classe Management Update Component', () => {
    let comp: ClasseUpdateComponent;
    let fixture: ComponentFixture<ClasseUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let classeService: ClasseService;
    let userService: UserService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ClasseUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ClasseUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ClasseUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      classeService = TestBed.inject(ClasseService);
      userService = TestBed.inject(UserService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call User query and add missing value', () => {
        const classe: IClasse = { id: 456 };
        const prof: IUser = { id: 13820 };
        classe.prof = prof;
        const students: IUser[] = [{ id: 8136 }];
        classe.students = students;

        const userCollection: IUser[] = [{ id: 62330 }];
        spyOn(userService, 'query').and.returnValue(of(new HttpResponse({ body: userCollection })));
        const additionalUsers = [prof, ...students];
        const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
        spyOn(userService, 'addUserToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ classe });
        comp.ngOnInit();

        expect(userService.query).toHaveBeenCalled();
        expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
        expect(comp.usersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const classe: IClasse = { id: 456 };
        const prof: IUser = { id: 48385 };
        classe.prof = prof;
        const students: IUser = { id: 2487 };
        classe.students = [students];

        activatedRoute.data = of({ classe });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(classe));
        expect(comp.usersSharedCollection).toContain(prof);
        expect(comp.usersSharedCollection).toContain(students);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const classe = { id: 123 };
        spyOn(classeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ classe });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: classe }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(classeService.update).toHaveBeenCalledWith(classe);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const classe = new Classe();
        spyOn(classeService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ classe });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: classe }));
        saveSubject.complete();

        // THEN
        expect(classeService.create).toHaveBeenCalledWith(classe);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const classe = { id: 123 };
        spyOn(classeService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ classe });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(classeService.update).toHaveBeenCalledWith(classe);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackUserById', () => {
        it('Should return tracked User primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUserById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedUser', () => {
        it('Should return option if no User is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedUser(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected User for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedUser(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this User is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedUser(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
