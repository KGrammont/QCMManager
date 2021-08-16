import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { QcmComponent } from './list/qcm.component';
import { QcmUpdateComponent } from './update/qcm-update.component';
import { QcmRoutingModule } from './route/qcm-routing.module';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@NgModule({
  imports: [SharedModule, QcmRoutingModule, NgxExtendedPdfViewerModule],
  declarations: [QcmComponent, QcmUpdateComponent],
})
export class QcmModule {}
