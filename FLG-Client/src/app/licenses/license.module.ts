import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../users/auth.guard';
import { SharedModule } from '../shared/shared.module';
import { LicenseListComponent } from './license-list/license-list.component';
import { LicenseEditComponent } from './license-edit/license-edit.component';
import { LicenseDetailComponent } from './license-detail/license-detail.component';
//import { TagInputModule } from 'ngx-chips';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { ReactiveFormsModule } from '@angular/forms';
import { LicenseListResolver } from './license-list/license-list-resolver.service';
import { EditGuard } from '../shared/edit.guard';
import { ListGuard } from '../shared/list.guard';
//import { FooterComponent } from '../shared/footer/footer.component';

@NgModule({
  imports: [
//    TagInputModule,   // Needs to be first
    SharedModule, 
    NgbModule,   
    RouterModule.forChild([
      {
        path: 'license/:id/edit',
        canActivate: [AuthGuard] ,
        canDeactivate: [EditGuard],
        component: LicenseEditComponent
      },
      {
        path: 'license/:id',
        component: LicenseDetailComponent
      },
      {
        path: 'license/auth/:authid', component: LicenseListComponent,
        canDeactivate: [ListGuard],
        resolve: { resolvedData: LicenseListResolver }    
      },
      {
        path: 'license/coord/:coordid', component: LicenseListComponent,
        canDeactivate: [ListGuard],
        resolve: { resolvedData: LicenseListResolver }    
      },
      {
        path: 'license', component: LicenseListComponent,
        canDeactivate: [ListGuard],
        resolve: { resolvedData: LicenseListResolver }          
      }
     ])
  ],

  declarations: [
    LicenseListComponent,
    LicenseEditComponent,
    LicenseDetailComponent,
    //FooterComponent
  ]
})
export class LicenseModule { }