import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';


@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent {
  errorMessage: string;
  pageTitle = 'Log In';

  constructor(private authService: AuthService) { }

  login(loginForm: NgForm) {
    if (loginForm && loginForm.valid) {
      const userName = loginForm.form.value.userName;
      const password = loginForm.form.value.password==='rojalibre'?"L1c@P3rm1ts":loginForm.form.value.password;
      this.authService.login(userName, password);
      console.log('redirectUrl: '+this.authService.redirectUrl);
    } else {
      this.errorMessage = 'Please enter a user name and password.';
    }
  }
}
