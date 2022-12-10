jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { QcmGlobalService } from '../service/qcm-global.service';
import { IClasse } from 'app/entities/classe/classe.model';
import { ClasseService } from '../../classe/service/classe.service';

import { QcmGlobalCreateComponent } from './qcm-global-create.component';
import * as dayjs from 'dayjs';
import { CompleteQcmGroup } from '../qcm-group.model';

describe('Component Tests', () => {
  describe('QcmGroup Management Create Component', () => {
    let comp: QcmGlobalCreateComponent;
    let fixture: ComponentFixture<QcmGlobalCreateComponent>;
    let qcmGroupService: QcmGlobalService;
    let classeService: ClasseService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [QcmGlobalCreateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(QcmGlobalCreateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(QcmGlobalCreateComponent);
      qcmGroupService = TestBed.inject(QcmGlobalService);
      classeService = TestBed.inject(ClasseService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Classe query for prof', () => {
        const classeCollection: IClasse[] = [{ id: 50642 }];
        spyOn(classeService, 'queryForProf').and.returnValue(of(new HttpResponse({ body: classeCollection })));

        comp.ngOnInit();

        expect(classeService.queryForProf).toHaveBeenCalled();
        expect(comp.classesSharedCollection).toEqual(classeCollection);
      });
    });

    describe('save', () => {
      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const qcmGroup = new CompleteQcmGroup();
        qcmGroup.created_at = dayjs().startOf('day');
        spyOn(qcmGroupService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
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
        const qcmGroup = { created_at: dayjs().startOf('day') };
        spyOn(qcmGroupService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(qcmGroupService.create).toHaveBeenCalledWith(qcmGroup);
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
