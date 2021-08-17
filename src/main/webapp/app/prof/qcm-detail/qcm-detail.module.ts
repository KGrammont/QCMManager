import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { QcmDetailComponent as QcmDetailComponent } from './list/qcm-detail.component';
import { QcmDetailUpdateComponent as QcmDetailUpdateComponent } from './update/qcm-detail-update.component';
import { QcmDetailRoutingModule as QcmDetailRoutingModule } from './route/qcm-detail-routing.module';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@NgModule({
  imports: [SharedModule, QcmDetailRoutingModule, NgxExtendedPdfViewerModule],
  declarations: [QcmDetailComponent, QcmDetailUpdateComponent],
})
export class QcmDetailModule {}
