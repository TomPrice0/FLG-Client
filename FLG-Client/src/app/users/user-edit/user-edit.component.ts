import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../data.service';
import { Location } from '@angular/common';
import { User, newUser } from '../user';
import { AuthService } from '../auth.service';
import { HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { Validator } from '../../shared/validator';

@Component({
  selector: 'pm-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})

export class UserEditComponent implements OnInit {

  userList=[];
  userListPtr: number;
  currentUser: User;
  originalUser: User;

  get user():User {
    return this.currentUser;
  }
  set user(value:User) {
    this.currentUser = value;
    // Clone the object to retain a copy
    this.originalUser = value ? { ...value } : null;
  }

  goBack() {
    if (this.auth.isWdbEntry)
    {
      this.auth.currentUser.updatedDate=null;
      if (!!this.auth.redirectUrl){
        let url=this.auth.redirectUrl;
        this.auth.redirectUrl=null;
        this.router.navigateByUrl(url);
      }
      else
        this.router.navigateByUrl('/student');
    }
    else
      this._location.back();
  }

  // https://stackoverflow.com/questions/54889941/how-to-use-math-min-or-math-max-syntax-in-angular-template
  get math() {
    return Math;
  }


  get isDirty(): boolean {
    return JSON.stringify(this.originalUser) !== JSON.stringify(this.currentUser);
  }
  
  constructor(private dataService: DataService, public auth: AuthService, private route: ActivatedRoute, 
    private router: Router, private _location: Location, private v: Validator) { }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
          const id = +params['id'];
          console.log(id);
          this.getUser(id);
      }
    );
    let list=sessionStorage.getItem('userlist');
    if (list){ 
      this.userList=JSON.parse(list);
    } 
  }

  getUser(id){
   if (id>0){
    this.dataService.getUser(id).subscribe((data: User)=>{
        //       console.log(data);
        this.user = data;
        this.userListPtr=this.userList.findIndex(x=>x===+id);
  //     console.log('User find',this.userList,this.userListPtr,id);     
      });
    }
    else
      this.user=newUser();
  }

  @HostListener('window:beforeunload')
    canDeactivate(): Observable<boolean> | boolean {  
        return !this.isDirty;
    }

  @ViewChild('userForm', {static: false}) userForm: any;

  update():void {
    if (this.v.validate(this.userForm)){
      this.dataService.updateUser(this.user).subscribe((data: number)=>{
        if (this.auth.isWdbEntry)
          this.router.navigateByUrl(this.auth.redirectUrl);
        this.user.id=data;
        this.user=this.user;  // Resets base for dirty
      });
    }
  }
}