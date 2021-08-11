import { Route } from '@angular/router';
import { Authority } from 'app/config/authority.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SettingsComponent } from './settings.component';

export const settingsRoute: Route = {
  path: 'settings',
  component: SettingsComponent,
  data: {
    pageTitle: 'Profil',
    authorities: [Authority.ADMIN, Authority.PROF],
  },
  canActivate: [UserRouteAccessService],
};
