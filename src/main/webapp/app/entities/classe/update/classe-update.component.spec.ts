jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ClasseService } from '../service/classe.service';
import { IClasse, Classe, SelectableUser } from '../classe.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { ClasseUpdateComponent } from './classe-update.component';
import { AccountService } from 'app/core/auth/account.service';
import { Authority } from 'app/config/authority.constants';

describe('Component Tests', () => {
  describe('Classe Management Update Component', () => {
    let comp: ClasseUpdateComponent;
    let fixture: ComponentFixture<ClasseUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let classeService: ClasseService;
    let userService: UserService;
    const accountService = {
      hasAnyAuthority: jest.fn(() => true),
      identity: jest.fn(() => null),
    };

    beforeEach(() => {
      TestBed.overrideProvider(AccountService, { useValue: accountService });
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ClasseUpdateComponent],
        providers: [FormBuilder, ActivatedRoute, AccountService],
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
      it('Should call student and prof query and update selected students when ADMIN', () => {
        const classe: IClasse = { id: 456 };
        const students: IUser[] = [{ id: 8136 }];
        classe.students = students;

        const studentsFromQuery: IUser[] = [{ id: 62330 }, { id: 8136 }];
        spyOn(userService, 'queryStudents').and.returnValue(of(new HttpResponse({ body: studentsFromQuery })));
        const expectedSelectableStudents: SelectableUser[] = [
          { id: 62330, isSelected: false },
          { id: 8136, isSelected: true },
        ];

        spyOn(accountService, 'hasAnyAuthority').and.returnValue(true);
        const expectedProfs: IUser[] = [{ id: 1243 }];
        spyOn(userService, 'queryProfs').and.returnValue(of(new HttpResponse({ body: expectedProfs })));

        activatedRoute.data = of({ classe });
        comp.ngOnInit();

        expect(accountService.hasAnyAuthority).toHaveBeenCalledWith(Authority.ADMIN);
        expect(userService.queryStudents).toHaveBeenCalled();
        expect(userService.queryProfs).toHaveBeenCalled();
        expect(comp.studentsSharedCollection).toEqual(expectedSelectableStudents);
        expect(comp.profsSharedCollection).toEqual(expectedProfs);
      });

      it('Should put itself on prof and call only student query and update selectable students when not ADMIN', () => {
        const classe: IClasse = { id: 456 };
        const prof: IUser = { id: 13820 };
        const students: IUser[] = [{ id: 8136 }];
        classe.students = students;

        const studentsFromQuery: IUser[] = [{ id: 62330 }, { id: 8136 }];
        spyOn(userService, 'queryStudents').and.returnValue(of(new HttpResponse({ body: studentsFromQuery })));
        const expectedSelectableStudents: SelectableUser[] = [
          { id: 62330, isSelected: false },
          { id: 8136, isSelected: true },
        ];

        spyOn(accountService, 'hasAnyAuthority').and.returnValue(false);
        spyOn(accountService, 'identity').and.returnValue(of(prof));

        activatedRoute.data = of({ classe });
        comp.ngOnInit();

        expect(accountService.hasAnyAuthority).toHaveBeenCalledWith(Authority.ADMIN);
        expect(userService.queryStudents).toHaveBeenCalled();
        expect(comp.studentsSharedCollection).toEqual(expectedSelectableStudents);
        expect(comp.editForm.get(['prof'])!.value).toEqual(prof);
      });

      it('Should update editForm', () => {
        const classe: IClasse = { id: 456, name: 'name' };
        const prof: IUser = { id: 48385 };
        classe.prof = prof;
        const students: IUser = { id: 2487 };
        classe.students = [students];

        activatedRoute.data = of({ classe });
        comp.ngOnInit();

        expect(comp.editForm.get(['id'])!.value).toEqual(classe.id);
        expect(comp.editForm.get(['name'])!.value).toEqual(classe.name);
        expect(comp.editForm.get(['prof'])!.value).toEqual(prof);
        expect(comp.selectedStudents).toContain(students);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const classe = { id: 123, students: [] };
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
        classe.students = [];
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
        const classe = { id: 123, students: [] };
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
  });
});
