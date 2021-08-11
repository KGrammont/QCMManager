import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { User } from '../student-management.model';
import { StudentManagementService } from '../service/student-management.service';

@Component({
  selector: 'jhi-user-mgmt-update',
  templateUrl: './student-management-update.component.html',
})
export class StudentManagementUpdateComponent implements OnInit {
  user!: User;
  isSaving = false;

  editForm = this.fb.group({
    lastName: ['', [Validators.maxLength(50)]],
    firstName: ['', [Validators.maxLength(50)]],
    email: ['', [Validators.minLength(5), Validators.maxLength(254), Validators.email]],
    login: [
      '',
      [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$'),
      ],
    ],
    pass: ['', []],
  });

  constructor(private userService: StudentManagementService, private route: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.route.data.subscribe(({ user }) => {
      if (user) {
        this.user = user;
        if (this.user.id === undefined) {
          this.user.pass = this.generateRandomPass();
        }
        this.updateForm(user);
      }
    });
    this.editForm.get(['firstName'])!.valueChanges.subscribe((value: string) => {
      const lastname: string = this.editForm.get(['lastName'])!.value ?? '';
      const login = value + lastname;
      this.editForm.get(['login'])!.setValue(login.toLowerCase());
    });
    this.editForm.get(['lastName'])!.valueChanges.subscribe((value: string) => {
      const firstname: string = this.editForm.get(['firstName'])!.value ?? '';
      const login = firstname + value;
      this.editForm.get(['login'])!.setValue(login.toLowerCase());
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    this.updateUser(this.user);
    if (this.user.id !== undefined) {
      this.userService.update(this.user).subscribe(
        () => this.onSaveSuccess(),
        () => this.onSaveError()
      );
    } else {
      this.userService.create(this.user).subscribe(
        () => this.onSaveSuccess(),
        () => this.onSaveError()
      );
    }
  }

  private generateRandomPass(): string {
    let pass = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 4; i++) {
      pass += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return pass;
  }

  private updateForm(user: User): void {
    this.editForm.patchValue({
      lastName: user.lastName,
      firstName: user.firstName,
      email: user.email,
      login: user.login,
      pass: user.pass,
    });
  }

  private updateUser(user: User): void {
    user.lastName = this.editForm.get(['lastName'])!.value;
    user.firstName = this.editForm.get(['firstName'])!.value;
    user.email = this.editForm.get(['email'])!.value;
    user.login = this.editForm.get(['login'])!.value;
  }

  private onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  private onSaveError(): void {
    this.isSaving = false;
  }
}
