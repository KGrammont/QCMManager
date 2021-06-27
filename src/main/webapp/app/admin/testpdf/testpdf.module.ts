import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

import { TestpdfComponent } from './testpdf.component';
import { testpdfRoute } from './testpdf.route';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([testpdfRoute])],
  declarations: [TestpdfComponent],
})
export class TestpdfModule {}
