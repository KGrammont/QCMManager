import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IQcmGroup } from '../qcm-group.model';
import { QcmGlobalService } from '../service/qcm-global.service';

@Component({
  templateUrl: './qcm-group-delete-dialog.component.html',
})
export class QcmGroupDeleteDialogComponent {
  qcmGroup?: IQcmGroup;

  constructor(protected qcmGroupService: QcmGlobalService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.qcmGroupService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
