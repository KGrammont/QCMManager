import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IQcmGroup } from '../qcm-group.model';

@Component({
  selector: 'jhi-qcm-group-detail',
  templateUrl: './qcm-group-detail.component.html',
})
export class QcmGroupDetailComponent implements OnInit {
  qcmGroup: IQcmGroup | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ qcmGroup }) => {
      this.qcmGroup = qcmGroup;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
