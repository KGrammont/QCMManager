import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IQcm, Qcm } from '../qcm.model';
import { QcmService } from '../service/qcm.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-qcm-update',
  templateUrl: './qcm-update.component.html',
})
export class QcmUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    subject: [],
    subjectContentType: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected qcmService: QcmService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ qcm }) => {
      this.updateForm(qcm);
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
      subject: qcm.subject,
      subjectContentType: qcm.subjectContentType,
    });
  }

  protected createFromForm(): IQcm {
    return {
      ...new Qcm(),
      id: this.editForm.get(['id'])!.value,
      subjectContentType: this.editForm.get(['subjectContentType'])!.value,
      subject: this.editForm.get(['subject'])!.value,
    };
  }
}
