import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorListComponent } from './vendor-list/vendor-list.component';
import { VendorEditComponent } from './vendor-edit/vendor-edit.component';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../users/auth.guard';
import { EditGuard } from '../shared/edit.guard';
import { ListGuard } from '../shared/list.guard';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'vendor/:id/edit',
        canActivate: [AuthGuard] ,
        canDeactivate: [EditGuard],
        component: VendorEditComponent
      },
      {
        path: 'vendor', component: VendorListComponent,
        canActivate: [AuthGuard] ,
        canDeactivate: [ListGuard],
      }
     ])
  ],
  declarations: [
    VendorListComponent,
    VendorEditComponent,
  ]
})
export class VendorModule { }
