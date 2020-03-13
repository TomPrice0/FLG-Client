import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { DataService } from 'src/app/data.service';
import { LicenseListResolved } from './license-list';
import { AuthService } from 'src/app/users/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LicenseListResolver implements Resolve<LicenseListResolved> {
  authName: string;
  constructor(private dataService: DataService, private auth: AuthService) { }

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<any> {
    return this.dataService.getAllLicenses()
      .pipe(map(license=>({license: license})), // TODO: Is the catchError below needed?
          catchError(error=> {
            const message = `Retrieval error: ${error}`;
            console.error(message);
            return of({ license: null, error: message });
        })
      );
    };
  }