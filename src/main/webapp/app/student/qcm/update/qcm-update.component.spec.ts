jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { IQcm } from '../../../entities/qcm/qcm.model';

import { QcmUpdateComponent } from './qcm-update.component';

describe('Component Tests', () => {
  describe('Qcm Update Component', () => {
    let comp: QcmUpdateComponent;
    let fixture: ComponentFixture<QcmUpdateComponent>;
    let activatedRoute: ActivatedRoute;

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
  });
});
