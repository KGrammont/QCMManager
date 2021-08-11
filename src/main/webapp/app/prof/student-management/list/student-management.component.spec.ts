jest.mock('@angular/router');
jest.mock('app/core/auth/account.service');

import { ComponentFixture, TestBed, waitForAsync, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { StudentManagementService } from '../service/student-management.service';
import { User } from '../student-management.model';
import { AccountService } from 'app/core/auth/account.service';

import { StudentManagementComponent } from './student-management.component';

describe('Component Tests', () => {
  describe('Student Management Component', () => {
    let comp: StudentManagementComponent;
    let fixture: ComponentFixture<StudentManagementComponent>;
    let service: StudentManagementService;
    let mockAccountService: AccountService;
    const data = of({
      defaultSort: 'id,asc',
    });
    const queryParamMap = of(
      jest.requireActual('@angular/router').convertToParamMap({
        page: '1',
        size: '1',
        sort: 'id,desc',
      })
    );

    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          imports: [HttpClientTestingModule],
          declarations: [StudentManagementComponent],
          providers: [Router, { provide: ActivatedRoute, useValue: { data, queryParamMap } }, AccountService],
        })
          .overrideTemplate(StudentManagementComponent, '')
          .compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(StudentManagementComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(StudentManagementService);
      mockAccountService = TestBed.inject(AccountService);
      mockAccountService.identity = jest.fn(() => of(null));
    });

    describe('OnInit', () => {
      it('Should call load all on init', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          const headers = new HttpHeaders().append('link', 'link;link');
          spyOn(service, 'query').and.returnValue(
            of(
              new HttpResponse({
                body: [new User(123)],
                headers,
              })
            )
          );

          // WHEN
          comp.ngOnInit();
          tick(); // simulate async

          // THEN
          expect(service.query).toHaveBeenCalled();
          expect(comp.users?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        })
      ));
    });
  });
});
