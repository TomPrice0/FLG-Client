import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../users/auth.guard';
import { EditGuard } from '../shared/edit.guard';
import { SharedModule } from '../shared/shared.module';
import { AuthorityListComponent } from './authority-list/authority-list.component';
import { AuthorityEditComponent } from './authority-edit/authority-edit.component';
import { AuthorityListResolver } from './authority-list/authority-list-resolver.service';
import { ListGuard } from '../shared/list.guard';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: 'authority/:id/edit',
        component: AuthorityEditComponent,
        canActivate: [AuthGuard],
        canDeactivate: [EditGuard]   
          //    resolve: { resolvedData: LicenseResolver }
      },
      {
        path: 'authority/coord/:coordid', component: AuthorityListComponent ,
        canActivate: [AuthGuard],
        resolve: { resolvedData: AuthorityListResolver }      
      },    
      {
        path: 'authority', component: AuthorityListComponent ,
        canActivate: [AuthGuard],
        canDeactivate: [ListGuard],
        resolve: { resolvedData: AuthorityListResolver }      
      }
     ])
  ],

  declarations: [
    AuthorityListComponent,
    AuthorityEditComponent 
  ]
})
export class AuthorityModule { }