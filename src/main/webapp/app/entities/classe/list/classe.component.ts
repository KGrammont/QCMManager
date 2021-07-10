import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IClasse } from '../classe.model';
import { ClasseService } from '../service/classe.service';
import { ClasseDeleteDialogComponent } from '../delete/classe-delete-dialog.component';

@Component({
  selector: 'jhi-classe',
  templateUrl: './classe.component.html',
})
export class ClasseComponent implements OnInit {
  classes?: IClasse[];
  isLoading = false;

  constructor(protected classeService: ClasseService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.classeService.query().subscribe(
      (res: HttpResponse<IClasse[]>) => {
        this.isLoading = false;
        this.classes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IClasse): number {
    return item.id!;
  }

  delete(classe: IClasse): void {
    const modalRef = this.modalService.open(ClasseDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.classe = classe;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
