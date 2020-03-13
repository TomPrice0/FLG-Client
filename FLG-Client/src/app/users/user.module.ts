import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';
import { AuthGuard } from './auth.guard';
import { SharedModule } from '../shared/shared.module';
import { UserListComponent } from './user-list/user-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { ListGuard } from '../shared/list.guard';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
  imports: [
    SharedModule,
//    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    RouterModule.forChild([
      {
        path: 'user/:id/edit', component: UserEditComponent,
          canActivate: [AuthGuard]
      },
      {
        path: 'user', component: UserListComponent,
        canActivate: [AuthGuard],
        canDeactivate: [ListGuard]      
          //    resolve: { resolvedData: LicenseResolver }
      },
      { path: 'login', component: LoginComponent }
    ])
  ],

  declarations: [
    LoginComponent,
    UserListComponent,
    UserEditComponent 
  ]
})
export class UserModule { }
