jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { QcmService } from '../service/qcm.service';
import { IQcm, Qcm } from '../qcm.model';
import { IQcmGroup } from 'app/entities/qcm-group/qcm-group.model';
import { QcmGroupService } from 'app/entities/qcm-group/service/qcm-group.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { QcmUpdateComponent } from './qcm-update.component';

describe('Component Tests', () => {
  describe('Qcm Management Update Component', () => {
    let comp: QcmUpdateComponent;
    let fixture: ComponentFixture<QcmUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let qcmService: QcmService;
    let qcmGroupService: QcmGroupService;
    let userService: UserService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [QcmUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(QcmUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(QcmUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      qcmService = TestBed.inject(QcmService);
      qcmGroupService = TestBed.inject(QcmGroupService);
      userService = TestBed.inject(UserService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call QcmGroup query and add missing value', () => {
        const qcm: IQcm = { id: 456 };
        const qcmGroup: IQcmGroup = { id: 58065 };
        qcm.qcmGroup = qcmGroup;

        const qcmGroupCollection: IQcmGroup[] = [{ id: 25104 }];
        spyOn(qcmGroupService, 'query').and.returnValue(of(new HttpResponse({ body: qcmGroupCollection })));
        const additionalQcmGroups = [qcmGroup];
        const expectedCollection: IQcmGroup[] = [...additionalQcmGroups, ...qcmGroupCollection];
        spyOn(qcmGroupService, 'addQcmGroupToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ qcm });
        comp.ngOnInit();

        expect(qcmGroupService.query).toHaveBeenCalled();
        expect(qcmGroupService.addQcmGroupToCollectionIfMissing).toHaveBeenCalledWith(qcmGroupCollection, ...additionalQcmGroups);
        expect(comp.qcmGroupsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call User query and add missing value', () => {
        const qcm: IQcm = { id: 456 };
        const student: IUser = { id: 27699 };
        qcm.student = student;

        const userCollection: IUser[] = [{ id: 87926 }];
        spyOn(userService, 'query').and.returnValue(of(new HttpResponse({ body: userCollection })));
        const additionalUsers = [student];
        const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
        spyOn(userService, 'addUserToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ qcm });
        comp.ngOnInit();

        expect(userService.query).toHaveBeenCalled();
        expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
        expect(comp.usersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const qcm: IQcm = { id: 456 };
        const qcmGroup: IQcmGroup = { id: 91630 };
        qcm.qcmGroup = qcmGroup;
        const student: IUser = { id: 47918 };
        qcm.student = student;

        activatedRoute.data = of({ qcm });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(qcm));
        expect(comp.qcmGroupsSharedCollection).toContain(qcmGroup);
        expect(comp.usersSharedCollection).toContain(student);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const qcm = { id: 123 };
        spyOn(qcmService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ qcm });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: qcm }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(qcmService.update).toHaveBeenCalledWith(qcm);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const qcm = new Qcm();
        spyOn(qcmService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ qcm });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: qcm }));
        saveSubject.complete();

        // THEN
        expect(qcmService.create).toHaveBeenCalledWith(qcm);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const qcm = { id: 123 };
        spyOn(qcmService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ qcm });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(qcmService.update).toHaveBeenCalledWith(qcm);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackQcmGroupById', () => {
        it('Should return tracked QcmGroup primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackQcmGroupById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

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
