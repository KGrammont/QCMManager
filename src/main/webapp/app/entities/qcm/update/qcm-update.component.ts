import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IQcm, Qcm } from '../qcm.model';
import { QcmService } from '../service/qcm.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IQcmGroup } from 'app/entities/qcm-group/qcm-group.model';
import { QcmGroupService } from 'app/entities/qcm-group/service/qcm-group.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-qcm-update',
  templateUrl: './qcm-update.component.html',
})
export class QcmUpdateComponent implements OnInit {
  isSaving = false;

  qcmGroupsSharedCollection: IQcmGroup[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    question: [null, [Validators.required]],
    questionContentType: [],
    answer: [],
    answerContentType: [],
    completeAnswer: [],
    completeAnswerContentType: [],
    correction: [],
    correctionContentType: [],
    created_at: [null, [Validators.required]],
    qcmGroup: [null, Validators.required],
    student: [null, Validators.required],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected qcmService: QcmService,
    protected qcmGroupService: QcmGroupService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ qcm }) => {
      if (qcm.id === undefined) {
        const today = dayjs().startOf('day');
        qcm.createdAt = today;
      }

      this.updateForm(qcm);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(
          new EventWithContent<AlertError>('qcmManagerApp.error', { message: err.message })
        ),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const qcm = this.createFromForm();
    if (qcm.id !== undefined) {
      this.subscribeToSaveResponse(this.qcmService.update(qcm));
    } else {
      this.subscribeToSaveResponse(this.qcmService.create(qcm));
    }
  }

  trackQcmGroupById(index: number, item: IQcmGroup): number {
    return item.id!;
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IQcm>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
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

  protected updateForm(qcm: IQcm): void {
    this.editForm.patchValue({
      id: qcm.id,
      question: qcm.question,
      questionContentType: qcm.questionContentType,
      answer: qcm.answer,
      answerContentType: qcm.answerContentType,
      completeAnswer: qcm.completeAnswer,
      completeAnswerContentType: qcm.completeAnswerContentType,
      correction: qcm.correction,
      correctionContentType: qcm.correctionContentType,
      created_at: qcm.createdAt ? qcm.createdAt.format(DATE_TIME_FORMAT) : null,
      qcmGroup: qcm.qcmGroup,
      student: qcm.student,
    });

    this.qcmGroupsSharedCollection = this.qcmGroupService.addQcmGroupToCollectionIfMissing(this.qcmGroupsSharedCollection, qcm.qcmGroup);
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, qcm.student);
  }

  protected loadRelationshipsOptions(): void {
    this.qcmGroupService
      .query()
      .pipe(map((res: HttpResponse<IQcmGroup[]>) => res.body ?? []))
      .pipe(
        map((qcmGroups: IQcmGroup[]) =>
          this.qcmGroupService.addQcmGroupToCollectionIfMissing(qcmGroups, this.editForm.get('qcmGroup')!.value)
        )
      )
      .subscribe((qcmGroups: IQcmGroup[]) => (this.qcmGroupsSharedCollection = qcmGroups));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('student')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IQcm {
    return {
      ...new Qcm(),
      id: this.editForm.get(['id'])!.value,
      questionContentType: this.editForm.get(['questionContentType'])!.value,
      question: this.editForm.get(['question'])!.value,
      answerContentType: this.editForm.get(['answerContentType'])!.value,
      answer: this.editForm.get(['answer'])!.value,
      completeAnswerContentType: this.editForm.get(['completeAnswerContentType'])!.value,
      completeAnswer: this.editForm.get(['completeAnswer'])!.value,
      correctionContentType: this.editForm.get(['correctionContentType'])!.value,
      correction: this.editForm.get(['correction'])!.value,
      createdAt: this.editForm.get(['created_at'])!.value ? dayjs(this.editForm.get(['created_at'])!.value, DATE_TIME_FORMAT) : undefined,
      qcmGroup: this.editForm.get(['qcmGroup'])!.value,
      student: this.editForm.get(['student'])!.value,
    };
  }
}
