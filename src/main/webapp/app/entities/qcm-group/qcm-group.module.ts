import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { QcmGroupComponent } from './list/qcm-group.component';
import { QcmGroupDetailComponent } from './detail/qcm-group-detail.component';
import { QcmGroupUpdateComponent } from './update/qcm-group-update.component';
import { QcmGroupDeleteDialogComponent } from './delete/qcm-group-delete-dialog.component';
import { QcmGroupRoutingModule } from './route/qcm-group-routing.module';

@NgModule({
  imports: [SharedModule, QcmGroupRoutingModule],
  declarations: [QcmGroupComponent, QcmGroupDetailComponent, QcmGroupUpdateComponent, QcmGroupDeleteDialogComponent],
  entryComponents: [QcmGroupDeleteDialogComponent],
})
export class QcmGroupModule {}
