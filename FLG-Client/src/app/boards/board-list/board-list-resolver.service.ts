import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { DataService } from 'src/app/data.service';
import { BoardList, BoardListResolved } from './board-list';
import { AuthService } from 'src/app/users/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BoardListResolver implements Resolve<BoardListResolved> {
  authName: string;
  constructor(private dataService: DataService, private auth: AuthService) { }

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<BoardListResolved> {

  return this.dataService.getAll('board')
    .pipe(
      map(a=>({authorityList: a})), // TODO: Is the catchError below needed?
        catchError(error=> {
          const message = `Retrieval error: ${error}`;
          console.error(message);
          return of({ authorityList: null, error: message });
      })
    );
  }
}
