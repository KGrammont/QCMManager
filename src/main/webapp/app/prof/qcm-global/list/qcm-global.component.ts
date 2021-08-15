import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICompleteQcmGroup } from '../qcm-group.model';
import { QcmGlobalService } from '../service/qcm-global.service';
import { QcmGroupDeleteDialogComponent } from '../delete/qcm-group-delete-dialog.component';

@Component({
  selector: 'jhi-qcm-group',
  templateUrl: './qcm-global.component.html',
})
export class QcmGlobalComponent implements OnInit {
  qcmGroups?: ICompleteQcmGroup[];
  isLoading = false;

  constructor(protected qcmGroupService: QcmGlobalService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.qcmGroupService.query().subscribe(
      (res: HttpResponse<ICompleteQcmGroup[]>) => {
        this.isLoading = false;
        this.qcmGroups = res.body?.sort((a, b) => (a.created_at! < b.created_at! ? 1 : -1)) ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICompleteQcmGroup): number {
    return item.id!;
  }

  delete(qcmGroup: ICompleteQcmGroup): void {
    const modalRef = this.modalService.open(QcmGroupDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.qcmGroup = qcmGroup;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
