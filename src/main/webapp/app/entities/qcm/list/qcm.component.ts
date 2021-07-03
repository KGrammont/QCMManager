import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IQcm } from '../qcm.model';
import { QcmService } from '../service/qcm.service';
import { QcmDeleteDialogComponent } from '../delete/qcm-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-qcm',
  templateUrl: './qcm.component.html',
})
export class QcmComponent implements OnInit {
  qcms?: IQcm[];
  isLoading = false;

  constructor(protected qcmService: QcmService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.qcmService.query().subscribe(
      (res: HttpResponse<IQcm[]>) => {
        this.isLoading = false;
        this.qcms = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IQcm): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(qcm: IQcm): void {
    const modalRef = this.modalService.open(QcmDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.qcm = qcm;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
