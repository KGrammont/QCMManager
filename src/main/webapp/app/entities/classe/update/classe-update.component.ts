import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IClasse, Classe, SelectableUser } from '../classe.model';
import { ClasseService } from '../service/classe.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { AccountService } from 'app/core/auth/account.service';
import { Authority } from 'app/config/authority.constants';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';

@Component({
  selector: 'jhi-classe-update',
  templateUrl: './classe-update.component.html',
})
export class ClasseUpdateComponent implements OnInit {
  isLoading = false;
  isSaving = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;

  profsSharedCollection: IUser[] = [];
  selectedStudents: IUser[] = [];
  studentsSharedCollection: SelectableUser[] | null = null;

  editForm;

  constructor(
    protected classeService: ClasseService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: UntypedFormBuilder,
    private accountService: AccountService
  ) {
    this.editForm = this.fb.group({
      id: [],
      name: [null, [Validators.required]],
      prof: [null, Validators.required],
      students: [],
    });
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ classe }) => {
      this.updateForm(classe);

      this.handleNavigation();
      this.loadProfs();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const classe = this.createFromForm();
    if (classe.id !== undefined) {
      this.subscribeToSaveResponse(this.classeService.update(classe));
    } else {
      this.subscribeToSaveResponse(this.classeService.create(classe));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  loadPageStudents(): void {
    this.isLoading = true;
    this.userService
      .queryStudents({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: [this.predicate + ',' + (this.ascending ? 'asc' : 'desc'), 'id'],
      })
      .subscribe(
        (res: HttpResponse<IUser[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers);
        },
        () => (this.isLoading = false)
      );
  }

  transition(): void {
    this.loadPageStudents();
  }

  addStudent(student: SelectableUser): void {
    student.isSelected = true;
    this.selectedStudents.push(student);
  }

  removeStudent(student: SelectableUser): void {
    student.isSelected = false;
    this.selectedStudents = this.selectedStudents.filter((s: IUser) => s.id !== student.id);
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IClasse>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected loadProfs(): void {
    if (this.accountService.hasAnyAuthority(Authority.ADMIN)) {
      this.userService
        .queryProfs()
        .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
        .subscribe((users: IUser[]) => (this.profsSharedCollection = users));
    } else {
      this.accountService.identity().subscribe(profAccount => this.editForm.get(['prof'])!.setValue(profAccount));
    }
  }

  protected updateForm(classe: IClasse): void {
    this.editForm.patchValue({
      id: classe.id,
      name: classe.name,
      prof: classe.prof,
    });
    this.selectedStudents = classe.students ?? [];
  }

  protected createFromForm(): IClasse {
    return {
      ...new Classe(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      prof: this.editForm.get(['prof'])!.value,
      students: this.selectedStudents.length !== 0 ? this.selectedStudents : undefined,
    };
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  private handleNavigation(): void {
    this.page = 1;
    this.predicate = 'login';
    this.ascending = true;
    this.loadPageStudents();
  }

  private onSuccess(users: IUser[] | null, headers: HttpHeaders): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.studentsSharedCollection =
      users?.map((user: IUser) => {
        const isSelected = this.selectedStudents.find((student: IUser) => student.id === user.id) !== undefined;
        return new SelectableUser(isSelected, user.id, user.login, user.firstName, user.lastName);
      }) ?? null;
  }
}
