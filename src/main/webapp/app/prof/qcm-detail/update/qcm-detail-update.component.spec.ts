jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { IQcm } from '../../../entities/qcm/qcm.model';

import { QcmDetailUpdateComponent } from './qcm-detail-update.component';

describe('Component Tests', () => {
  describe('Qcm Update Component', () => {
    let comp: QcmDetailUpdateComponent;
    let fixture: ComponentFixture<QcmDetailUpdateComponent>;
    let activatedRoute: ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [QcmDetailUpdateComponent],
        providers: [ActivatedRoute],
      })
        .overrideTemplate(QcmDetailUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(QcmDetailUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update qcm and pdf', () => {
        const qcm: IQcm = { id: 456, question: 'pdfquestion', answer: 'pdfanswer' };

        activatedRoute.data = of({ qcm });
        comp.ngOnInit();

        expect(comp.qcm).toEqual(qcm);
        expect(comp.pdf).toEqual('pdfanswer');
      });
    });
  });
});
