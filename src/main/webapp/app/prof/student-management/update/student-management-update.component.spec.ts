import { ComponentFixture, TestBed, waitForAsync, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { Authority } from 'app/config/authority.constants';
import { StudentManagementService } from '../service/student-management.service';
import { User } from '../student-management.model';

import { StudentManagementUpdateComponent } from './student-management-update.component';

describe('Component Tests', () => {
  describe('Student Management Update Component', () => {
    let comp: StudentManagementUpdateComponent;
    let fixture: ComponentFixture<StudentManagementUpdateComponent>;
    let service: StudentManagementService;

    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          imports: [HttpClientTestingModule],
          declarations: [StudentManagementUpdateComponent],
          providers: [
            FormBuilder,
            {
              provide: ActivatedRoute,
              useValue: {
                data: of({
                  user: new User(123, 'user', 'first', 'last', 'first@last.com', 'pass', true, 'fr', [Authority.STUDENT], 'admin'),
                }),
              },
            },
          ],
        })
          .overrideTemplate(StudentManagementUpdateComponent, '')
          .compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(StudentManagementUpdateComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(StudentManagementService);
    });

    describe('save', () => {
      it('Should call update service on save for existing user', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          const entity = new User(123);
          spyOn(service, 'update').and.returnValue(
            of(
              new HttpResponse({
                body: entity,
              })
            )
          );
          comp.user = entity;
          comp.editForm.patchValue({ id: entity.id });
          // WHEN
          comp.save();
          tick(); // simulate async

          // THEN
          expect(service.update).toHaveBeenCalledWith(entity);
          expect(comp.isSaving).toEqual(false);
        })
      ));

      it('Should call create service on save for new user', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          const entity = new User();
          spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
          comp.user = entity;
          // WHEN
          comp.save();
          tick(); // simulate async

          // THEN
          expect(service.create).toHaveBeenCalledWith(entity);
          expect(comp.isSaving).toEqual(false);
        })
      ));
    });
  });
});
