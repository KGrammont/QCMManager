import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';

import * as dayjs from 'dayjs';

import { ICompleteQcmGroup, CompleteQcmGroup } from '../qcm-group.model';
import { QcmGlobalService } from '../service/qcm-global.service';
import { IClasse } from 'app/entities/classe/classe.model';
import { ClasseService } from 'app/entities/classe/service/classe.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { AlertError } from 'app/shared/alert/alert-error.model';

@Component({
  selector: 'jhi-qcm-group-update',
  templateUrl: './qcm-global-create.component.html',
})
export class QcmGlobalCreateComponent implements OnInit {
  isSaving = false;

  classesSharedCollection: IClasse[] = [];

  editForm;

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected qcmGroupService: QcmGlobalService,
    protected classeService: ClasseService,
    protected fb: UntypedFormBuilder
  ) {
    this.editForm = this.fb.group({
      name: [null, Validators.required],
      classe: [null, Validators.required],
      qcms: [null, [Validators.required]],
      qcmsContentType: [],
    });
  }

  ngOnInit(): void {
    this.loadRelationshipsOptions();
  }

  previousState(): void {
    window.history.back();
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    const eventTarget: HTMLInputElement | null = event.target as HTMLInputElement | null;
    if (eventTarget?.files?.[0]) {
      const file: File = eventTarget.files[0];
      this.editForm.patchValue({ qcmsContentType: file.type });
      this.editForm.get(['qcmsContentType'])!.markAsDirty();
      if (file.type === 'application/pdf') {
        this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
          error: (err: FileLoadError) =>
            this.eventManager.broadcast(
              new EventWithContent<AlertError>('qcmManagerApp.error', { message: err.message })
            ),
        });
      }
    }
  }

  save(): void {
    this.isSaving = true;
    const qcmGroup = this.createFromForm();
    this.qcmGroupService.create(qcmGroup).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  trackClasseById(index: number, item: IClasse): number {
    return item.id!;
  }

  protected onSaveSuccess(): void {
    this.previousState();
    this.isSaving = false;
  }

  protected onSaveError(): void {
    // Api for inheritance.
    this.isSaving = false;
  }

  protected loadRelationshipsOptions(): void {
    this.classeService
      .queryForProf()
      .pipe(map((res: HttpResponse<IClasse[]>) => res.body ?? []))
      .subscribe((classes: IClasse[]) => (this.classesSharedCollection = classes));
  }

  protected createFromForm(): ICompleteQcmGroup {
    const today = dayjs().startOf('day');
    return {
      ...new CompleteQcmGroup(),
      name: this.editForm.get(['name'])!.value ?? undefined,
      createdAt: today,
      classe: this.editForm.get(['classe'])!.value ?? undefined,
      qcms: this.editForm.get(['qcms'])!.value ?? undefined,
    };
  }
}
