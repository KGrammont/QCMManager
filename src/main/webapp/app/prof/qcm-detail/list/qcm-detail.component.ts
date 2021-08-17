import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IQcm } from '../../../entities/qcm/qcm.model';
import { QcmDetailService } from '../service/qcm-detail.service';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-qcm',
  templateUrl: './qcm-detail.component.html',
})
export class QcmDetailComponent implements OnInit {
  qcms?: IQcm[];
  isLoading = false;

  constructor(protected qcmService: QcmDetailService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

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
}
