import { Component, OnInit, NgModule } from '@angular/core';
import { DataService } from '../../data.service';
import { ListHelperService } from 'src/app/shared/list-helper.service';

@Component({
  selector: 'pm-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  
  users;
 
  cols=[
    {name: "name", label: "Name"},
    {name: "phone", label: "Phone"},
    {name: "email", label: "Email"},
    {name: "authorities", label: "Authorities"},
    {name: "licenses", label: "Licenses"},
    {name: "updated", label: "Updated"},
  ]

  get searchTerms(): string{
    return sessionStorage.getItem('userSearchTerms')||'';
  }
  set searchTerms(val: string) {
    sessionStorage.setItem('userSearchTerms', val);
  }
   
  constructor(private dataService: DataService, public lh: ListHelperService) { }
  
  ngOnInit() {
    this.lh.list='user';
    this.lh.default='name';
    this.dataService.getAll('user').subscribe((data: any)=>{
//        console.log(data);
        this.users = data;
        this.lh.array=this.users;
        this.lh.orderDesc=!this.lh.orderDesc;
        this.lh.setOrder(this.lh.listOrder);
    }) 
  }

  mailAllCoord():string{
    return this.users.filter(u=>u.email && this.filterResults(u)).map(u=>u.email).join(';')
  }

  mailAllAdmin():string{
    return this.users.filter(u=>u.permlevel!==2 && u.email && this.filterResults(u)).map(u=>u.email).join(';');
  }

  mailNotStarted():string{
    return this.users.filter(u=>u.permlevel==2 && u.updated==0 && u.email && this.filterResults(u)).map(u=>u.email).join(';');
  }

  mailNotFinished():string{
    return this.users.filter(u=>u.permlevel==2 && u.updated<100 && u.email && this.filterResults(u)).map(u=>u.email).join(';');
  }
  
  filterResults (user: any){
    const re=new RegExp(this.searchTerms, 'gi');
    return user.name.match(re);
  }
  
  // TODO: Refactor this and ones in license/authority list into a single version
  saveList() {
    let list=[];
    this.users.forEach(l=> {if (this.filterResults(l))
      list.push(l.id);
    });
    sessionStorage.setItem("userlist",JSON.stringify(list));
  } 
}
