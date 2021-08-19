import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IQcmGroup, QcmGroup } from '../qcm-group.model';
import { QcmGroupService } from '../service/qcm-group.service';
import { IClasse } from 'app/entities/classe/classe.model';
import { ClasseService } from 'app/entities/classe/service/classe.service';

@Component({
  selector: 'jhi-qcm-group-update',
  templateUrl: './qcm-group-update.component.html',
})
export class QcmGroupUpdateComponent implements OnInit {
  isSaving = false;

  classesSharedCollection: IClasse[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    created_at: [null, [Validators.required]],
    classe: [null, Validators.required],
  });

  constructor(
    protected qcmGroupService: QcmGroupService,
    protected classeService: ClasseService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ qcmGroup }) => {
      if (qcmGroup.id === undefined) {
        const today = dayjs().startOf('day');
        qcmGroup.createdAt = today;
      }

      this.updateForm(qcmGroup);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const qcmGroup = this.createFromForm();
    if (qcmGroup.id !== undefined) {
      this.subscribeToSaveResponse(this.qcmGroupService.update(qcmGroup));
    } else {
      this.subscribeToSaveResponse(this.qcmGroupService.create(qcmGroup));
    }
  }

  trackClasseById(index: number, item: IClasse): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IQcmGroup>>): void {
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

  protected updateForm(qcmGroup: IQcmGroup): void {
    this.editForm.patchValue({
      id: qcmGroup.id,
      name: qcmGroup.name,
      created_at: qcmGroup.createdAt ? qcmGroup.createdAt.format(DATE_TIME_FORMAT) : null,
      classe: qcmGroup.classe,
    });

    this.classesSharedCollection = this.classeService.addClasseToCollectionIfMissing(this.classesSharedCollection, qcmGroup.classe);
  }

  protected loadRelationshipsOptions(): void {
    this.classeService
      .query()
      .pipe(map((res: HttpResponse<IClasse[]>) => res.body ?? []))
      .pipe(map((classes: IClasse[]) => this.classeService.addClasseToCollectionIfMissing(classes, this.editForm.get('classe')!.value)))
      .subscribe((classes: IClasse[]) => (this.classesSharedCollection = classes));
  }

  protected createFromForm(): IQcmGroup {
    return {
      ...new QcmGroup(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      createdAt: this.editForm.get(['created_at'])!.value ? dayjs(this.editForm.get(['created_at'])!.value, DATE_TIME_FORMAT) : undefined,
      classe: this.editForm.get(['classe'])!.value,
    };
  }
}
