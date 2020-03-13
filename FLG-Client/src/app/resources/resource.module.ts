import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceListComponent } from './resource-list/resource-list.component';
import { ResourceEditComponent } from './resource-edit/resource-edit.component';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../users/auth.guard';
import { EditGuard } from '../shared/edit.guard';
import { ListGuard } from '../shared/list.guard';
import { SharedModule } from '../shared/shared.module';
import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    QuillModule.forRoot(),  
    RouterModule.forChild([
      {
        path: 'resource/:id/edit',
        canActivate: [AuthGuard] ,
        canDeactivate: [EditGuard],
        component: ResourceEditComponent
      },
      {
        path: 'resource', component: ResourceListComponent,
        canActivate: [AuthGuard] ,
        canDeactivate: [ListGuard],
      }
     ])
  ],
  declarations: [
    ResourceListComponent,
    ResourceEditComponent,
  ]
})
export class ResourceModule { }
