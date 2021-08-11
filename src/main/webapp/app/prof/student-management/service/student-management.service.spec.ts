import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { User } from '../student-management.model';

import { StudentManagementService } from './student-management.service';

describe('Service Tests', () => {
  describe('Student Service', () => {
    let service: StudentManagementService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });

      service = TestBed.inject(StudentManagementService);
      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    describe('Service methods', () => {
      it('should return Student', () => {
        let expectedResult: string | undefined;

        service.find('Student').subscribe(received => {
          expectedResult = received.login;
        });

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(new User(123, 'user'));
        expect(expectedResult).toEqual('user');
      });

      it('should propagate not found response', () => {
        let expectedResult = 0;

        service.find('user').subscribe({
          error: (error: HttpErrorResponse) => (expectedResult = error.status),
        });

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush('Invalid request parameters', {
          status: 404,
          statusText: 'Bad Request',
        });
        expect(expectedResult).toEqual(404);
      });
    });
  });
});
