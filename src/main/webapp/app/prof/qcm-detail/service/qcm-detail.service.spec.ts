import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IQcm, Qcm } from '../../../entities/qcm/qcm.model';

import { QcmDetailService } from './qcm-detail.service';

describe('Service Tests', () => {
  describe('Qcm Service', () => {
    let service: QcmDetailService;
    let httpMock: HttpTestingController;
    let elemDefault: IQcm;
    let expectedResult: IQcm | IQcm[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(QcmDetailService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        questionContentType: 'image/png',
        question: 'AAAAAAA',
        answerContentType: 'image/png',
        answer: 'AAAAAAA',
        completeAnswerContentType: 'image/png',
        completeAnswer: 'AAAAAAA',
        correctionContentType: 'image/png',
        correction: 'AAAAAAA',
        created_at: currentDate,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            created_at: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Qcm', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            created_at: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            created_at: currentDate,
          },
          returnedFromService
        );

        service.create(new Qcm()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Qcm', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            question: 'BBBBBB',
            answer: 'BBBBBB',
            completeAnswer: 'BBBBBB',
            correction: 'BBBBBB',
            created_at: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            created_at: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Qcm', () => {
        const patchObject = Object.assign(
          {
            answer: 'BBBBBB',
            created_at: currentDate.format(DATE_TIME_FORMAT),
          },
          new Qcm()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            created_at: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Qcm', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            question: 'BBBBBB',
            answer: 'BBBBBB',
            completeAnswer: 'BBBBBB',
            correction: 'BBBBBB',
            created_at: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            created_at: currentDate,
          },
          returnedFromService
        );

        service.query(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      describe('addQcmToCollectionIfMissing', () => {
        it('should add a Qcm to an empty array', () => {
          const qcm: IQcm = { id: 123 };
          expectedResult = service.addQcmToCollectionIfMissing([], qcm);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(qcm);
        });

        it('should not add a Qcm to an array that contains it', () => {
          const qcm: IQcm = { id: 123 };
          const qcmCollection: IQcm[] = [
            {
              ...qcm,
            },
            { id: 456 },
          ];
          expectedResult = service.addQcmToCollectionIfMissing(qcmCollection, qcm);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Qcm to an array that doesn't contain it", () => {
          const qcm: IQcm = { id: 123 };
          const qcmCollection: IQcm[] = [{ id: 456 }];
          expectedResult = service.addQcmToCollectionIfMissing(qcmCollection, qcm);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(qcm);
        });

        it('should add only unique Qcm to an array', () => {
          const qcmArray: IQcm[] = [{ id: 123 }, { id: 456 }, { id: 17815 }];
          const qcmCollection: IQcm[] = [{ id: 123 }];
          expectedResult = service.addQcmToCollectionIfMissing(qcmCollection, ...qcmArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const qcm: IQcm = { id: 123 };
          const qcm2: IQcm = { id: 456 };
          expectedResult = service.addQcmToCollectionIfMissing([], qcm, qcm2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(qcm);
          expect(expectedResult).toContain(qcm2);
        });

        it('should accept null and undefined values', () => {
          const qcm: IQcm = { id: 123 };
          expectedResult = service.addQcmToCollectionIfMissing([], null, qcm, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(qcm);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
