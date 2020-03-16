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
        path: 'student',
        data: { preload: false },
        loadChildren: () =>
          import('./students/student.module').then(m => m.StudentModule)
      },
      {
        path: 'board',
        data: { preload: false },
        loadChildren: () =>
          import('./boards/board.module').then(m => m.BoardModule)
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
