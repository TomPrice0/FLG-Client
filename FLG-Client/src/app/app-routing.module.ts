import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WelcomeComponent } from './home/welcome.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { SelectiveStrategy } from './selective-strategy.service';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: 'welcome', component: WelcomeComponent },
      {
        path: 'license',
        data: { preload: false },
        loadChildren: () =>
          import('./licenses/license.module').then(m => m.LicenseModule)
      },
      {
        path: 'authority',
        data: { preload: false },
        loadChildren: () =>
          import('./authorities/authority.module').then(m => m.AuthorityModule)
      },
      {
        path: 'user',
        data: { preload: false },
        loadChildren: () =>
          import('./users/user.module').then(m => m.UserModule)
      },
      { path: '', redirectTo: 'welcome', pathMatch: 'full' },
      { path: '**', component: PageNotFoundComponent }
    ], { enableTracing: false, preloadingStrategy: SelectiveStrategy })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
