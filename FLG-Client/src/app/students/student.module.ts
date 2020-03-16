import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../users/auth.guard';
import { SharedModule } from '../shared/shared.module';
import { StudentListComponent } from './student-list/student-list.component';
import { StudentEditComponent } from './student-edit/student-edit.component';
import { StudentDetailComponent } from './student-detail/student-detail.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StudentListResolver } from './student-list/student-list-resolver.service';
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
        path: 'student/:id/edit',
        canActivate: [AuthGuard] ,
        canDeactivate: [EditGuard],
        component: StudentEditComponent
      },
      {
        path: 'student/:id',
        component: StudentDetailComponent
      },
      {
        path: 'student/auth/:authid', component: StudentListComponent,
        canDeactivate: [ListGuard],
        resolve: { resolvedData: StudentListResolver }    
      },
      {
        path: 'student/coord/:coordid', component: StudentListComponent,
        canDeactivate: [ListGuard],
        resolve: { resolvedData: StudentListResolver }    
      },
      {
        path: 'student', component: StudentListComponent,
        canDeactivate: [ListGuard],
        resolve: { resolvedData: StudentListResolver }          
      }
     ])
  ],

  declarations: [
    StudentListComponent,
    StudentEditComponent,
    StudentDetailComponent,
    //FooterComponent
  ]
})
export class StudentModule { }