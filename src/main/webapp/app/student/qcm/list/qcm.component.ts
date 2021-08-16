import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IQcm } from '../qcm.model';
import { QcmService } from '../service/qcm.service';
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
        this.qcms = res.body?.sort((a, b) => (a.created_at! < b.created_at! ? 1 : -1));
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
}
