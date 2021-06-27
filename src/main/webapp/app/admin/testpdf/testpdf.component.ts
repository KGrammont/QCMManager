import { Component, OnInit } from '@angular/core';

import { TestpdfService } from './testpdf.service';

@Component({
  selector: 'jhi-testpdf',
  templateUrl: './testpdf.component.html',
})
export class TestpdfComponent implements OnInit {
  constructor(private testpdfService: TestpdfService) {
    // do nothing.
  }

  ngOnInit(): void {
    console.error('YOUHOU');
  }
}
