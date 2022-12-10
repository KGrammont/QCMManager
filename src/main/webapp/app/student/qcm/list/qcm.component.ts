import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IQcm } from '../../../entities/qcm/qcm.model';
import { QcmService } from '../service/qcm.service';
import { DataUtils } from 'app/core/util/data-util.service';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'jhi-qcm',
  templateUrl: './qcm.component.html',
})
export class QcmComponent implements OnInit {
  qcms?: IQcm[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  ngbPaginationPage = 1;

  constructor(
    protected qcmService: QcmService,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: DataUtils,
    protected router: Router,
    protected modalService: NgbModal
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.qcmService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: ['created_at,desc', 'id'],
      })
      .subscribe(
        (res: HttpResponse<IQcm[]>) => {
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

  trackId(index: number, item: IQcm): number {
    return item.id!;
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

  protected onSuccess(data: IQcm[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/student/qcm'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: ['created_at,desc', 'id'],
        },
      });
    }
    this.qcms = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
