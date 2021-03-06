jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { QcmGroupService } from '../service/qcm-group.service';
import { IQcmGroup, QcmGroup } from '../qcm-group.model';
import { IClasse } from 'app/entities/classe/classe.model';
import { ClasseService } from 'app/entities/classe/service/classe.service';

import { QcmGroupUpdateComponent } from './qcm-group-update.component';

describe('Component Tests', () => {
  describe('QcmGroup Management Update Component', () => {
    let comp: QcmGroupUpdateComponent;
    let fixture: ComponentFixture<QcmGroupUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let qcmGroupService: QcmGroupService;
    let classeService: ClasseService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [QcmGroupUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(QcmGroupUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(QcmGroupUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      qcmGroupService = TestBed.inject(QcmGroupService);
      classeService = TestBed.inject(ClasseService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Classe query and add missing value', () => {
        const qcmGroup: IQcmGroup = { id: 456 };
        const classe: IClasse = { id: 56412 };
        qcmGroup.classe = classe;

        const classeCollection: IClasse[] = [{ id: 50642 }];
        spyOn(classeService, 'query').and.returnValue(of(new HttpResponse({ body: classeCollection })));
        const additionalClasses = [classe];
        const expectedCollection: IClasse[] = [...additionalClasses, ...classeCollection];
        spyOn(classeService, 'addClasseToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ qcmGroup });
        comp.ngOnInit();

        expect(classeService.query).toHaveBeenCalled();
        expect(classeService.addClasseToCollectionIfMissing).toHaveBeenCalledWith(classeCollection, ...additionalClasses);
        expect(comp.classesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const qcmGroup: IQcmGroup = { id: 456 };
        const classe: IClasse = { id: 4110 };
        qcmGroup.classe = classe;

        activatedRoute.data = of({ qcmGroup });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(qcmGroup));
        expect(comp.classesSharedCollection).toContain(classe);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const qcmGroup = { id: 123 };
        spyOn(qcmGroupService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ qcmGroup });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: qcmGroup }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(qcmGroupService.update).toHaveBeenCalledWith(qcmGroup);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const qcmGroup = new QcmGroup();
        spyOn(qcmGroupService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ qcmGroup });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: qcmGroup }));
        saveSubject.complete();

        // THEN
        expect(qcmGroupService.create).toHaveBeenCalledWith(qcmGroup);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const qcmGroup = { id: 123 };
        spyOn(qcmGroupService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ qcmGroup });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(qcmGroupService.update).toHaveBeenCalledWith(qcmGroup);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackClasseById', () => {
        it('Should return tracked Classe primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackClasseById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
