import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { IQcm } from '../../../entities/qcm/qcm.model';
import { QcmDetailService } from '../service/qcm-detail.service';
import { CLASSES_MAX_SIZE } from 'app/config/pagination.constants';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { IQcmGroup } from 'app/entities/qcm-group/qcm-group.model';
import { QcmGlobalService } from 'app/prof/qcm-global/service/qcm-global.service';

@Component({
  selector: 'jhi-qcm',
  templateUrl: './qcm-detail.component.html',
})
export class QcmDetailComponent implements OnInit {
  allQcmGroups?: IQcmGroup[];
  selectedQcmGroup?: IQcmGroup;
  qcms?: IQcm[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = CLASSES_MAX_SIZE;
  page?: number;
  ngbPaginationPage = 1;

  constructor(
    protected qcmService: QcmDetailService,
    protected qcmGlobalService: QcmGlobalService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router
  ) {}

  loadQcmGroup(): void {
    this.qcmGlobalService
      .query({
        page: 0,
        size: this.itemsPerPage,
        sort: ['createdAt,desc', 'id'],
      })
      .subscribe((res: HttpResponse<IQcmGroup[]>) => {
        this.allQcmGroups = res.body ?? [];
        if (this.selectedQcmGroup === undefined) {
          this.selectedQcmGroup = this.allQcmGroups[0];
        }
        this.handleNavigation();
      });
  }

  loadPage(page?: number, dontNavigate?: boolean): void {
    if (this.selectedQcmGroup !== undefined) {
      this.isLoading = true;
      const pageToLoad: number = page ?? this.page ?? 1;
      this.qcmService
        .query(this.selectedQcmGroup.id!, {
          page: pageToLoad - 1,
          size: this.itemsPerPage,
          sort: ['createdAt,desc', 'id'],
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
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ qcmGroup }) => {
      if (qcmGroup.id !== undefined) {
        this.selectedQcmGroup = qcmGroup;
      }

      this.loadQcmGroup();
    });
  }

  trackId(index: number, item: IQcm): number {
    return item.id!;
  }

  trackQcmGroupById(index: number, item: IQcmGroup): number {
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
      this.router.navigate(['/prof/qcm-detail'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: ['createdAt,desc', 'id'],
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
