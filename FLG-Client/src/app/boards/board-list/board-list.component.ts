import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { AuthService } from '../../users/auth.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/users/user';
import { ListHelperService } from 'src/app/shared/list-helper.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'pm-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.css']
})
export class BoardListComponent implements OnInit {
  
  authorities=[];
  errorMessage;
  coordId: any;
  coordName: string;
  cols=[
    {name: "name", label: "Authority"},
    {name: "licnum", label: "Licenses"},
    {name: "updateddate", label: "Updated"}
  ];

  get searchTerms(): string{
    return sessionStorage.getItem('authSearchTerms')||'';
  }
  set searchTerms(val: string) {
    sessionStorage.setItem('authSearchTerms', val);
  }

  get agencyBoard(): string{
    return sessionStorage.getItem('authAgencyBoardSel')||'';
  }
  set agencyBoard(val: string) {
    sessionStorage.setItem('authAgencyBoardSel', val);
  }
   
  constructor(private auth: AuthService, private dataService: DataService, private route: ActivatedRoute, private title:Title,
    public lh: ListHelperService) { }
  
  ngOnInit() {
    this.title.setTitle(`All licensing authorities in North Carolina`);
    this.lh.list='auth';
    this.lh.default='name';
    this.coordId=this.route.snapshot.params['coordid'];  
    if (this.coordId){
        this.dataService.getUser(this.coordId).subscribe((data: User)=>{ 
        this.coordName=data.lastName+', '+data.firstName;  
      });
    }   
    this.route.data.subscribe(data => {
      const authorities: any = data.resolvedData;
      //console.log(authorities.authorityList);
      this.errorMessage = authorities.error;
      this.authorities = authorities.authorityList;
      this.authorities.forEach(a=>a.name=a.department+(a.division!==''?'/':'')+a.division+(a.board!==''?'/':'')+a.board);
      this.lh.array=this.authorities;
      this.lh.orderDesc=!this.lh.orderDesc;
      this.lh.setOrder(this.lh.listOrder);
    }) 
  }

  filterResults (authority: any){
    let terms=this.searchTerms.split(' ');
  //    console.log(this.coordId,authority.coordId);
    return (!this.coordId || +authority.coordId==this.coordId) &&  terms.every((term)=>{if (term.length==0) return true;
      let re=new RegExp(term, 'gi'); return authority.department.match(re) || authority.division.match(re) || authority.board.match(re);});    
  }

  saveList() {
    let list=[];
    this.authorities.forEach(a=> {if (this.filterResults(a))
      list.push(a.id);
    });
    sessionStorage.setItem("authlist",JSON.stringify(list));
//    console.log('Saving auth',list);
  }
}
