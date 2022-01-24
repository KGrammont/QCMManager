import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IClasse, Classe } from '../../../entities/classe/classe.model';

import { ClasseService } from './classe.service';

describe('Service Tests', () => {
  describe('Classe Service', () => {
    let service: ClasseService;
    let httpMock: HttpTestingController;
    let elemDefault: IClasse;
    let expectedResult: IClasse | IClasse[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ClasseService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should create a Classe', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Classe()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Classe', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Classe of current prof', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.queryForProf().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        expect(req.request.url).toEqual('api/custom/classes/of-current-prof');
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Classe', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addClasseToCollectionIfMissing', () => {
        it('should add a Classe to an empty array', () => {
          const classe: IClasse = { id: 123 };
          expectedResult = service.addClasseToCollectionIfMissing([], classe);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(classe);
        });

        it('should not add a Classe to an array that contains it', () => {
          const classe: IClasse = { id: 123 };
          const classeCollection: IClasse[] = [
            {
              ...classe,
            },
            { id: 456 },
          ];
          expectedResult = service.addClasseToCollectionIfMissing(classeCollection, classe);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Classe to an array that doesn't contain it", () => {
          const classe: IClasse = { id: 123 };
          const classeCollection: IClasse[] = [{ id: 456 }];
          expectedResult = service.addClasseToCollectionIfMissing(classeCollection, classe);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(classe);
        });

        it('should add only unique Classe to an array', () => {
          const classeArray: IClasse[] = [{ id: 123 }, { id: 456 }, { id: 71145 }];
          const classeCollection: IClasse[] = [{ id: 123 }];
          expectedResult = service.addClasseToCollectionIfMissing(classeCollection, ...classeArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const classe: IClasse = { id: 123 };
          const classe2: IClasse = { id: 456 };
          expectedResult = service.addClasseToCollectionIfMissing([], classe, classe2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(classe);
          expect(expectedResult).toContain(classe2);
        });

        it('should accept null and undefined values', () => {
          const classe: IClasse = { id: 123 };
          expectedResult = service.addClasseToCollectionIfMissing([], null, classe, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(classe);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
