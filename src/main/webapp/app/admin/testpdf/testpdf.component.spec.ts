import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestpdfComponent } from './testpdf.component';

describe('TestpdfComponent', () => {
  let component: TestpdfComponent;
  let fixture: ComponentFixture<TestpdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestpdfComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestpdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
