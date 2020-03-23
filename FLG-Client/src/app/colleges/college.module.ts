import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollegeListComponent } from './college-list/college-list.component';
import { CollegeEditComponent } from './college-edit/college-edit.component';
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
        path: 'college/:id/edit',
        canActivate: [AuthGuard] ,
        canDeactivate: [EditGuard],
        component: CollegeEditComponent
      },
      {
        path: 'college', component: CollegeListComponent,
        canActivate: [AuthGuard] ,
        canDeactivate: [ListGuard],
      }
     ])
  ],
  declarations: [
    CollegeListComponent,
    CollegeEditComponent,
  ]
})
export class CollegeModule { }
