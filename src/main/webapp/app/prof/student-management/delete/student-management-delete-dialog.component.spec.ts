jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, waitForAsync, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';

import { StudentManagementService } from '../service/student-management.service';

import { StudentManagementDeleteDialogComponent } from './student-management-delete-dialog.component';

describe('Component Tests', () => {
  describe('Student Management Delete Component', () => {
    let comp: StudentManagementDeleteDialogComponent;
    let fixture: ComponentFixture<StudentManagementDeleteDialogComponent>;
    let service: StudentManagementService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          imports: [HttpClientTestingModule],
          declarations: [StudentManagementDeleteDialogComponent],
          providers: [NgbActiveModal],
        })
          .overrideTemplate(StudentManagementDeleteDialogComponent, '')
          .compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(StudentManagementDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(StudentManagementService);
      mockActiveModal = TestBed.inject(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete('student');
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith('student');
          expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
        })
      ));
    });
  });
});
