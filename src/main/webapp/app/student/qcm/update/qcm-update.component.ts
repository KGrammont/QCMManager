import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IQcm } from '../../../entities/qcm/qcm.model';
import { QcmService } from '../service/qcm.service';
import { IPDFViewerApplication } from 'ngx-extended-pdf-viewer';
import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist/types/display/api';
import { Checkbox, CompleteQcmPatch } from 'app/shared/pdf/pdf.model';

@Component({
  selector: 'jhi-qcm-update',
  templateUrl: './qcm-update.component.html',
})
export class QcmUpdateComponent implements OnInit {
  isSaving = false;
  qcm?: IQcm;
  pdf?: string;
  responses: boolean[] = [];

  constructor(protected qcmService: QcmService, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ qcm }) => {
      this.qcm = qcm;
      this.pdf = qcm.question;
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;

    const PDFViewerApplication: IPDFViewerApplication = (window as any).PDFViewerApplication;
    const pdf: PDFDocumentProxy = PDFViewerApplication.pdfDocument;

    const checkboxes: Checkbox[] = [];

    pdf
      .getPage(1)
      .then((currentPage: PDFPageProxy) => currentPage.getAnnotations())
      .then((annotations: any[]) => {
        annotations.forEach(annotation => {
          const checkbox = new Checkbox(annotation.fieldName, annotation.fieldValue === 'Yes');
          const newValue = pdf.annotationStorage._storage.get(annotation.id)?.value;
          if (newValue !== undefined) {
            checkbox.value = newValue;
          }
          checkboxes.push(checkbox);
        });
      })
      .then(() =>
        this.qcmService.completePdf(new CompleteQcmPatch(this.qcm!.id!, 'answer', checkboxes)).subscribe(
          () => this.onSaveSuccess(),
          () => this.onSaveError()
        )
      );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }
}
