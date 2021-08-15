import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { QcmGlobalComponent } from './list/qcm-global.component';
import { QcmGlobalCreateComponent } from './create/qcm-global-create.component';
import { QcmGroupDeleteDialogComponent } from './delete/qcm-group-delete-dialog.component';
import { qcmGlobalRoute } from './qcm-global.route';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(qcmGlobalRoute)],
  declarations: [QcmGlobalComponent, QcmGlobalCreateComponent, QcmGroupDeleteDialogComponent],
  entryComponents: [QcmGroupDeleteDialogComponent],
})
export class QcmGlobalModule {}
