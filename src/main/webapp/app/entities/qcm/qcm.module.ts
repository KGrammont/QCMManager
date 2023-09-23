import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { QcmComponent } from './list/qcm.component';
import { QcmDetailComponent } from './detail/qcm-detail.component';
import { QcmUpdateComponent } from './update/qcm-update.component';
import { QcmDeleteDialogComponent } from './delete/qcm-delete-dialog.component';
import { QcmRoutingModule } from './route/qcm-routing.module';

@NgModule({
    imports: [SharedModule, QcmRoutingModule],
    declarations: [QcmComponent, QcmDetailComponent, QcmUpdateComponent, QcmDeleteDialogComponent]
})
export class QcmModule {}
