import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IQcmGroup } from '../qcm-group.model';
import { QcmGroupService } from '../service/qcm-group.service';
import { QcmGroupDeleteDialogComponent } from '../delete/qcm-group-delete-dialog.component';

@Component({
  selector: 'jhi-qcm-group',
  templateUrl: './qcm-group.component.html',
})
export class QcmGroupComponent implements OnInit {
  qcmGroups?: IQcmGroup[];
  isLoading = false;

  constructor(protected qcmGroupService: QcmGroupService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.qcmGroupService.query().subscribe(
      (res: HttpResponse<IQcmGroup[]>) => {
        this.isLoading = false;
        this.qcmGroups = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IQcmGroup): number {
    return item.id!;
  }

  delete(qcmGroup: IQcmGroup): void {
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
