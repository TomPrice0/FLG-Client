import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../users/auth.guard';
import { EditGuard } from '../shared/edit.guard';
import { SharedModule } from '../shared/shared.module';
import { BoardListComponent } from './board-list/board-list.component';
import { BoardEditComponent } from './board-edit/board-edit.component';
import { BoardListResolver } from './board-list/board-list-resolver.service';
import { ListGuard } from '../shared/list.guard';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: 'board/:id/edit',
        component: BoardEditComponent,
        canActivate: [AuthGuard],
        canDeactivate: [EditGuard]   
          //    resolve: { resolvedData: LicenseResolver }
      },
      {
        path: 'board/coord/:coordid', component: BoardListComponent ,
        canActivate: [AuthGuard],
        resolve: { resolvedData: BoardListResolver }      
      },    
      {
        path: 'board', component: BoardListComponent ,
        canActivate: [AuthGuard],
        canDeactivate: [ListGuard],
        resolve: { resolvedData: BoardListResolver }      
      }
     ])
  ],

  declarations: [
    BoardListComponent,
    BoardEditComponent 
  ]
})
export class BoardModule { }