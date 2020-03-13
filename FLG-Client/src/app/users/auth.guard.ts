import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private authService: AuthService,
              private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkLoggedIn(state.url) && this.checkProfileAllowed(state.url);
  }

  // Use the segments to build the full route
  // when using canLoad
  canLoad(route: Route, segments: UrlSegment[]): boolean {
    let url= segments.join('/');
    return this.checkLoggedIn(url) && this.checkProfileAllowed(url);
  }

  checkLoggedIn(url: string): boolean {
    if (this.authService.isLoggedIn) {
      return true;
    }

    // Retain the attempted URL for redirection
    this.authService.redirectUrl = url;
    this.router.navigate(['/login']);
    return false;
  }

  checkProfileAllowed(url: string): boolean {
    if (!this.authService.isCoordinator)
      return true;
    let segment=url.toLowerCase().split('/');
    if (segment.length<4)
      return true;
    if (segment[1]!=='user' || segment[3]!='edit')
      return true;
    return +segment[2]==this.authService.currentUser.id;
  }

}
