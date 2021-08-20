import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICompleteQcmGroup, IFileToDownload } from '../qcm-group.model';
import { QcmGlobalService } from '../service/qcm-global.service';
import { QcmGroupDeleteDialogComponent } from '../delete/qcm-group-delete-dialog.component';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'jhi-qcm-group',
  templateUrl: './qcm-global.component.html',
})
export class QcmGlobalComponent implements OnInit {
  qcmGroups?: ICompleteQcmGroup[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  ngbPaginationPage = 1;

  constructor(
    protected qcmGroupService: QcmGlobalService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.qcmGroupService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: ['createdAt,desc', 'id'],
      })
      .subscribe(
        (res: HttpResponse<ICompleteQcmGroup[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
        },
        () => {
          this.isLoading = false;
          this.onError();
        }
      );
  }

  ngOnInit(): void {
    this.handleNavigation();
  }

  trackId(index: number, item: ICompleteQcmGroup): number {
    return item.id!;
  }

  download(qcmGroup: ICompleteQcmGroup): void {
    this.qcmGroupService.download(qcmGroup.id!).subscribe(x => {
      const files = x.body;

      files?.forEach((file: IFileToDownload) => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (window.navigator?.msSaveOrOpenBlob) {
          const blob = new Blob([file.pdf!], { type: 'image/jpg' });
          window.navigator.msSaveOrOpenBlob(blob, `${file.name!}.jpg`);
          return;
        }

        const source = `data:image/jpg;base64,${file.pdf!}`;
        const link = document.createElement('a');
        link.href = source;
        link.download = `${file.name!}.jpg`;
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      });
    });
  }

  delete(qcmGroup: ICompleteQcmGroup): void {
    const modalRef = this.modalService.open(QcmGroupDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.qcmGroup = qcmGroup;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }

  protected handleNavigation(): void {
    combineLatest([this.activatedRoute.queryParamMap]).subscribe(([params]) => {
      const page = params.get('page');
      const pageNumber = page !== null ? +page : 1;
      if (pageNumber !== this.page) {
        this.loadPage(pageNumber, true);
      }
    });
  }

  protected onSuccess(data: ICompleteQcmGroup[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/prof/qcm-global'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: ['createdAt,desc', 'id'],
        },
      });
    }
    this.qcmGroups = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
