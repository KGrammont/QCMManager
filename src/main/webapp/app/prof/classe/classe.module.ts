import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { ClasseComponent } from './list/classe.component';
import { ClasseUpdateComponent } from './update/classe-update.component';
import { ClasseDeleteDialogComponent } from './delete/classe-delete-dialog.component';
import { ClasseRoutingModule } from './route/classe-routing.module';

@NgModule({
  imports: [SharedModule, ClasseRoutingModule],
  declarations: [ClasseComponent, ClasseUpdateComponent, ClasseDeleteDialogComponent],
  entryComponents: [ClasseDeleteDialogComponent],
})
export class ClasseModule {}
