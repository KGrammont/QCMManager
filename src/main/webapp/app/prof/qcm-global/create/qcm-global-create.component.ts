import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';

import * as dayjs from 'dayjs';

import { IQcmGroup, QcmGroup } from '../qcm-group.model';
import { QcmGlobalService } from '../service/qcm-global.service';
import { IClasse } from 'app/entities/classe/classe.model';
import { ClasseService } from 'app/entities/classe/service/classe.service';

@Component({
  selector: 'jhi-qcm-group-update',
  templateUrl: './qcm-global-create.component.html',
})
export class QcmGlobalCreateComponent implements OnInit {
  isSaving = false;

  classesSharedCollection: IClasse[] = [];

  editForm = this.fb.group({
    name: [null, Validators.required],
    classe: [null, Validators.required],
  });

  constructor(protected qcmGroupService: QcmGlobalService, protected classeService: ClasseService, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadRelationshipsOptions();
  }

  previousState(): void {
    window.history.back();
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

  protected createFromForm(): IQcmGroup {
    const today = dayjs().startOf('day');
    return {
      ...new QcmGroup(),
      name: this.editForm.get(['name'])!.value ?? undefined,
      created_at: today,
      classe: this.editForm.get(['classe'])!.value ?? undefined,
    };
  }
}
