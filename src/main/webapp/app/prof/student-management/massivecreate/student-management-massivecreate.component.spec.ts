import { ComponentFixture, TestBed, waitForAsync, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { StudentManagementService } from '../service/student-management.service';
import { User, UserCreationFeedback, UserPlusFeedback } from '../student-management.model';

import { StudentManagementMassiveCreateComponent } from './student-management-massivecreate.component';

describe('Component Tests', () => {
  describe('Student Management Massive Create Component', () => {
    let comp: StudentManagementMassiveCreateComponent;
    let fixture: ComponentFixture<StudentManagementMassiveCreateComponent>;
    let service: StudentManagementService;

    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          imports: [HttpClientTestingModule],
          declarations: [StudentManagementMassiveCreateComponent],
          providers: [],
        })
          .overrideTemplate(StudentManagementMassiveCreateComponent, '')
          .compileComponents();
      })
    );

    beforeEach(() => {
      fixture = TestBed.createComponent(StudentManagementMassiveCreateComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(StudentManagementService);
    });

    describe('save', () => {
      it('Should call create service on save', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          const user1 = new User(1, 'login', 'firstname', 'lastname', 'email1');
          const user2 = new User(2, 'login', 'firstname', 'lastname', 'email2');
          const user3 = new User(3, 'login', 'firstname', 'lastname', 'email3');
          const userPlus1 = new UserPlusFeedback(user1);
          const userPlus2 = new UserPlusFeedback(user2);
          const userPlus3 = new UserPlusFeedback(user3);
          const usersPlus = [userPlus1, userPlus2, userPlus3];
          const users = [user1, user2, user3];
          const entity1 = new UserCreationFeedback('email1', true, 'Créé');
          const entity2 = new UserCreationFeedback('email2', false, 'Le login existe déjà.');
          const entity3 = new UserCreationFeedback('email3', false, 'Toto');
          const feedbacks = [entity1, entity2, entity3];
          spyOn(service, 'massiveCreate').and.returnValue(of(feedbacks));
          comp.users = usersPlus;
          // WHEN
          comp.save();
          tick(); // simulate async

          // THEN
          const expectdUserPlus1 = new UserPlusFeedback(user1, true, 'Créé');
          const expectdUserPlus2 = new UserPlusFeedback(user2, false, 'Le login existe déjà.');
          const expectdUserPlus3 = new UserPlusFeedback(user3, false, 'Toto');
          expect(service.massiveCreate).toHaveBeenCalledWith(users);
          expect(comp.users).toContainEqual(expectdUserPlus1);
          expect(comp.users).toContainEqual(expectdUserPlus2);
          expect(comp.users).toContainEqual(expectdUserPlus3);
          expect(comp.isSaving).toEqual(true);
        })
      ));
    });
  });
});
