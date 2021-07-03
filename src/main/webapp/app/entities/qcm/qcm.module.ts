import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { QcmComponent } from './list/qcm.component';
import { QcmDetailComponent } from './detail/qcm-detail.component';
import { QcmUpdateComponent } from './update/qcm-update.component';
import { QcmDeleteDialogComponent } from './delete/qcm-delete-dialog.component';
import { QcmRoutingModule } from './route/qcm-routing.module';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@NgModule({
  imports: [SharedModule, QcmRoutingModule, NgxExtendedPdfViewerModule],
  declarations: [QcmComponent, QcmDetailComponent, QcmUpdateComponent, QcmDeleteDialogComponent],
  entryComponents: [QcmDeleteDialogComponent],
})
export class QcmModule {}
