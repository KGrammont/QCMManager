import { Route } from '@angular/router';

import { TestpdfComponent } from './testpdf.component';

export const testpdfRoute: Route = {
  path: '',
  component: TestpdfComponent,
  data: {
    pageTitle: 'Test PDF',
  },
};
