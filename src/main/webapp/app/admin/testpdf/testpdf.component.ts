import { Component, OnInit } from '@angular/core';

import { TestpdfService } from './testpdf.service';

@Component({
  selector: 'jhi-testpdf',
  templateUrl: './testpdf.component.html',
})
export class TestpdfComponent implements OnInit {
  public pdfblob: Blob | null = null;
  toto: string | null = null;

  constructor(private testpdfService: TestpdfService) {}

  ngOnInit(): void {
    this.getPdf();
  }

  private getPdf(): void {
    this.testpdfService.findPdf().subscribe(
      (response: Blob) => {
        this.toto = 'Hello here';
        this.pdfblob = response;
      },
      error => {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    );
  }
}
