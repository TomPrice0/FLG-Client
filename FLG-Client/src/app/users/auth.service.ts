import { Injectable, APP_INITIALIZER } from '@angular/core';

import { User } from './user';
import { MessageService } from '../messages/message.service';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  redirectUrl: string;

  get currentUser(): User{
    let _currentUser=JSON.parse(sessionStorage.getItem('currentUser'));
    return _currentUser;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  get isCoordinator(): boolean {
    if (!this.currentUser)
      return false;
    return this.currentUser['permLevel']==2;
  }

  get isBlncAdmin(): boolean {
    if (!this.currentUser)
      return false;
    return this.currentUser['permLevel']==3;
  }

  get isLeadAdmin(): boolean {
    if (!this.currentUser)
      return false;
    return this.currentUser['permLevel']==4;
  }

  constructor(private messageService: MessageService, private dataService: DataService, 
    private router: Router) {  }

  logout(): void {
    this.dataService.clearCache();
    sessionStorage.removeItem("currentUser");
  }

  login(userName: string, password: string): void {
    this.dataService.login(userName, password).subscribe((data: User)=>{
    //  console.log(data); 
      if  (data['error']){
   //     this.messageService.addMessage(data['error']);
        alert(data['error']);
        return;
      }
      let currentUser=data;
 
      sessionStorage.setItem("currentUser", JSON.stringify(currentUser));   

      if (currentUser.permLevel==2 && currentUser.updatedDate< this.getFilterDate()) {
        this.router.navigate(['/user',currentUser.id,'edit']);
      }
      else if (this.redirectUrl) {
        this.router.navigateByUrl(this.redirectUrl);
      }       else {
        this.router.navigate(['/license']);
      }
    });
  }

  getFilterDate(){
        let d=new Date();
        let e=new Date(d.getFullYear(),d.getMonth()-10,d.getDate(),0,0,0,0);
 //      console.log(e.toISOString());
        return e.toISOString();  
  }     
}
  
