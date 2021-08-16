jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { QcmService } from '../service/qcm.service';
import { IQcm } from '../qcm.model';

import { QcmUpdateComponent } from './qcm-update.component';
import { CompleteQcmPatch } from 'app/shared/pdf/pdf.model';

describe('Component Tests', () => {
  describe('Qcm Update Component', () => {
    let comp: QcmUpdateComponent;
    let fixture: ComponentFixture<QcmUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let qcmService: QcmService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [QcmUpdateComponent],
        providers: [ActivatedRoute],
      })
        .overrideTemplate(QcmUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(QcmUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      qcmService = TestBed.inject(QcmService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update qcm and pdf', () => {
        const qcm: IQcm = { id: 456, question: 'pdfquestion' };

        activatedRoute.data = of({ qcm });
        comp.ngOnInit();

        expect(comp.qcm).toEqual(qcm);
        expect(comp.pdf).toEqual('pdfquestion');
      });
    });

    // describe('save', () => {
    //   it('Should call update service on save for existing entity', () => {
    //     // GIVEN
    //     const saveSubject = new Subject();
    //     const qcm = { id: 123, question: 'pdfquestion' };
    //     const completeQcmPatch = new CompleteQcmPatch(123, 'answer', []);
    //     spyOn(qcmService, 'completePdf').and.returnValue(saveSubject);
    //     spyOn(comp, 'previousState');
    //     activatedRoute.data = of({ qcm });
    //     comp.ngOnInit();

    //     // WHEN
    //     comp.save();
    //     expect(comp.isSaving).toEqual(true);
    //     saveSubject.next(new HttpResponse({ body: qcm }));
    //     saveSubject.complete();

    //     // THEN
    //     expect(comp.previousState).toHaveBeenCalled();
    //     expect(qcmService.completePdf).toHaveBeenCalledWith(completeQcmPatch);
    //     expect(comp.isSaving).toEqual(false);
    //   });

    //   it('Should set isSaving to false on error', () => {
    //     // GIVEN
    //     const saveSubject = new Subject();
    //     const qcm = { id: 123, question: 'pdfquestion' };
    //     spyOn(qcmService, 'update').and.returnValue(saveSubject);
    //     spyOn(comp, 'previousState');
    //     activatedRoute.data = of({ qcm });
    //     comp.ngOnInit();

    //     // WHEN
    //     comp.save();
    //     expect(comp.isSaving).toEqual(true);
    //     saveSubject.error('This is an error!');

    //     // THEN
    //     expect(qcmService.update).toHaveBeenCalledWith(qcm);
    //     expect(comp.isSaving).toEqual(false);
    //     expect(comp.previousState).not.toHaveBeenCalled();
    //   });
    // });
  });
});
