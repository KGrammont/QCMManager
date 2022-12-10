import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { QcmGroupDetailComponent } from './qcm-group-detail.component';

describe('QcmGroup Management Detail Component', () => {
  let comp: QcmGroupDetailComponent;
  let fixture: ComponentFixture<QcmGroupDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QcmGroupDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ qcmGroup: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(QcmGroupDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(QcmGroupDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load qcmGroup on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.qcmGroup).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
