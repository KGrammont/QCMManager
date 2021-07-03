import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

import { TestpdfComponent } from './testpdf.component';
import { testpdfRoute } from './testpdf.route';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([testpdfRoute]), NgxExtendedPdfViewerModule],
  declarations: [TestpdfComponent],
})
export class TestpdfModule {}
