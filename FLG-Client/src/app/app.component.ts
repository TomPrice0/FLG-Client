import { Component } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';
import { AuthService } from './users/auth.service';
import { slideInAnimation } from './app.animation';

@Component({
  selector: 'pm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [slideInAnimation]
})
export class AppComponent {
  pageTitle = 'NC Business and Occupational License Database';
  metaTags = '';
  loading = true;  

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }
  
  get userName(): string {
    if (this.authService.currentUser) {
      return this.authService.currentUser.userName;
    }
    return '';
  }

  get coordId(): number {
    if (this.authService.currentUser) {
      return this.authService.currentUser.id;
    }
    return null;
  }

  get isCoordinator(): boolean {
    if (this.authService.currentUser){
      return this.authService.currentUser.permLevel==2;
    }
    return false;
  }

  get isBlncAdmin(): boolean {
    if (this.authService.currentUser){
      return this.authService.currentUser.permLevel==3;
    }
    return false;
  }

  get isLeadAdmin(): boolean {
    if (this.authService.currentUser){
      return this.authService.currentUser.permLevel==4;
    }
    return false;
  }
 
  constructor(private authService: AuthService,
              private router: Router) {
    router.events.subscribe((routerEvent: Event) => {
      this.checkRouterEvent(routerEvent);
    });
  }

  checkRouterEvent(routerEvent: Event): void {
    if (routerEvent instanceof NavigationStart) {
      this.loading = true;
    }

    if (routerEvent instanceof NavigationEnd ||
        routerEvent instanceof NavigationCancel ||
        routerEvent instanceof NavigationError) {
      this.loading = false;
    }
  }

  logOut(): void {
    this.authService.logout();
    this.router.navigateByUrl('/welcome');
  }
}
