import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IQcmGroup, QcmGroup } from '../qcm-group.model';

import { QcmGroupService } from './qcm-group.service';

describe('Service Tests', () => {
  describe('QcmGroup Service', () => {
    let service: QcmGroupService;
    let httpMock: HttpTestingController;
    let elemDefault: IQcmGroup;
    let expectedResult: IQcmGroup | IQcmGroup[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(QcmGroupService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
        createdAt: currentDate,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            createdAt: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a QcmGroup', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            createdAt: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            createdAt: currentDate,
          },
          returnedFromService
        );

        service.create(new QcmGroup()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a QcmGroup', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            createdAt: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            createdAt: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a QcmGroup', () => {
        const patchObject = Object.assign({}, new QcmGroup());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            createdAt: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of QcmGroup', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            createdAt: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            createdAt: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a QcmGroup', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addQcmGroupToCollectionIfMissing', () => {
        it('should add a QcmGroup to an empty array', () => {
          const qcmGroup: IQcmGroup = { id: 123 };
          expectedResult = service.addQcmGroupToCollectionIfMissing([], qcmGroup);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(qcmGroup);
        });

        it('should not add a QcmGroup to an array that contains it', () => {
          const qcmGroup: IQcmGroup = { id: 123 };
          const qcmGroupCollection: IQcmGroup[] = [
            {
              ...qcmGroup,
            },
            { id: 456 },
          ];
          expectedResult = service.addQcmGroupToCollectionIfMissing(qcmGroupCollection, qcmGroup);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a QcmGroup to an array that doesn't contain it", () => {
          const qcmGroup: IQcmGroup = { id: 123 };
          const qcmGroupCollection: IQcmGroup[] = [{ id: 456 }];
          expectedResult = service.addQcmGroupToCollectionIfMissing(qcmGroupCollection, qcmGroup);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(qcmGroup);
        });

        it('should add only unique QcmGroup to an array', () => {
          const qcmGroupArray: IQcmGroup[] = [{ id: 123 }, { id: 456 }, { id: 60895 }];
          const qcmGroupCollection: IQcmGroup[] = [{ id: 123 }];
          expectedResult = service.addQcmGroupToCollectionIfMissing(qcmGroupCollection, ...qcmGroupArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const qcmGroup: IQcmGroup = { id: 123 };
          const qcmGroup2: IQcmGroup = { id: 456 };
          expectedResult = service.addQcmGroupToCollectionIfMissing([], qcmGroup, qcmGroup2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(qcmGroup);
          expect(expectedResult).toContain(qcmGroup2);
        });

        it('should accept null and undefined values', () => {
          const qcmGroup: IQcmGroup = { id: 123 };
          expectedResult = service.addQcmGroupToCollectionIfMissing([], null, qcmGroup, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(qcmGroup);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
