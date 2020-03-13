import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../data.service';
import { AuthService } from '../../users/auth.service';
import { Location } from '@angular/common';
import stateData from '../../shared/states.json';
import { Authority, newAuthority } from '../authority';
import { HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { UserList } from 'src/app/users/user-list/user-list';
import { Validator } from '../../shared/validator';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'pm-authority-edit',
  templateUrl: './authority-edit.component.html',
  styleUrls: ['./authority-edit.component.css']
})
export class AuthorityEditComponent implements OnInit {

  authorities: Authority[];
  authList: number[];
  authListPtr: number;
  currentAuthority: Authority;
  originalAuthority: Authority;
  user: UserList;
  users: UserList[];
  states=[];
  showDepartmentSearchBox: boolean;  
  showDivisionSearchBox: boolean;
  searchCoordTerms: string='';
  showCoordSearchBox: boolean;
  isAllowedBoard: boolean;  
  isAllowedDepartment: boolean;
  isAddMode: boolean=false;

   // https://stackoverflow.com/questions/54889941/how-to-use-math-min-or-math-max-syntax-in-angular-template
   get math() {
    return Math;
  }

  get authority() {
    return this.currentAuthority;
  }
  set authority(value) {
    this.currentAuthority = value;
    // Clone the object to retain a copy
    this.originalAuthority = value ? { ...value } : null;
  } 
  
  constructor(public auth: AuthService, private dataService: DataService, private route: ActivatedRoute, private router:Router,
    private _location: Location, public v: Validator, private title: Title) { }

  ngOnInit() { 
    this.route.params.subscribe(
      params => {
          const id = +params['id'];
          this.getAuthority(id);
      }
    );
    
    let list=sessionStorage.getItem('authlist');
    if (list){      
      this.authList=JSON.parse(list);      
    }
    this.states=stateData;
    const id=this.route.snapshot.params['id'];
    this.dataService.getAllAuthorities().subscribe((data: Authority[])=>{
      this.authorities = data;
  //    console.log(data);
      this.getAuthority(id);
    });
    this.initCoordinatorList();
  }

  getAuthority(id){
    if (+id===0){
      this.isAddMode=true;
      this.authority=newAuthority();      
      if (this.authorities){
        const uniqueDept = [...new Set(this.authorities.map(a=>a.department))];
        if (uniqueDept.length==1)
          this.authority.department=this.authorities[0].department;
      //  this.authority.division=this.authorities[0].division;     // Nicole request 01/31/20
      }
      if (this.authorityForm){
//        console.log(this.authorityForm.form.controls)
        this.authorityForm.form.controls['searchCoordTerms'].status='INVALID';
      }
      this.validateName();     
//      console.log(this.authority);
    }
    else {
      this.dataService.getAuthority(id).subscribe((data: Authority)=>{
        if (!data)
          this.router.navigateByUrl('/**');
        this.authority=data;
        this.title.setTitle(`Editing ${this.authority.department}/${this.authority.division}/${this.authority.board}`);
        this.validateName();
        this.authListPtr=this.authList.findIndex(x=>x===+id);
        if (this.users)
          this.selectCoord(+this.authority.coordId);
      })
    };
  }  

  resetCoordId(event) {
    if (event.key=='Escape')
      this.selectCoord(+this.authority.coordId);
  }

  initCoordinatorList() {
    if (!this.auth.isCoordinator){
      this.dataService.getAllUsers().subscribe((data: UserList[])=>{
        this.users=data;
        this.selectCoord(+this.authority.coordId);
  //      this.authority=this.authority;
      });
    }
  }

  @HostListener('window:beforeunload')
    canDeactivate(): Observable<boolean> | boolean {  
        return !this.isDirty;
    }

  @ViewChild('authForm', {static: false}) authorityForm: any;

  get isDirty(): boolean {
//    console.log(this.originalAuthority,this.currentAuthority);
    return JSON.stringify(this.originalAuthority) !== JSON.stringify(this.currentAuthority);
  }

  deleteAuth(){
    if (confirm ("Are you sure?")){
      this.dataService.deleteAuthority(this.authority.id).subscribe(()=>{
        const n=this.authList.indexOf(this.authority.id);
        if (n>=0 && this.authList.length>1)
          this.authList.splice(n,1);
        this.goBack();}
      );
    }
  }

  getDepartment(){
    return this.authorities.map(a=>a.department);
  }

  getDivision(){
    return this.authorities.filter(a=>a.department==this.authority.department).map((a)=>a.division); 
  }

  goBack() {
    this._location.back();
  }

  filterDepartmentResults (name: any){
    const re=new RegExp(this.authority.department, 'gi');    
    return name.match(re);
  }

  // Almost identical to filterDepartmentResults
  filterDivisionResults (name: string){
    const re=new RegExp(this.authority.division, 'gi');    
    return name.match(re);
  }  
  
  filterCoordResults (user: any){
    const re=new RegExp(this.searchCoordTerms, 'gi');
    return user.name.match(re);
  }

  selectDepartment(department: string)
  {
    this.authority.department=department;
    let a=this.authorities.find(c=>c.department===department);
    if (a){
      this.authority.division=a.division;
    }
    this.showDepartmentSearchBox=false;
    return false; // Apparently needed but why? 02/01/20
  }
    
  departmentBoxIn(){
    this.showDepartmentSearchBox=true;
    this.showDivisionSearchBox=false;
    this.showCoordSearchBox=false;
  }
  
  divisionBoxIn(){
    this.showDepartmentSearchBox=false;
    this.showDivisionSearchBox=true;
    this.showCoordSearchBox=false;
  }
  
  selectDivision(division: string){
    this.authority.division=division;
    this.showDivisionSearchBox=false;
    return false; // Apparently needed but why? 02/01/20
  }

  hideSearchBoxes(){
    this.showDepartmentSearchBox=false;
    this.showDivisionSearchBox=false;
    this.showCoordSearchBox=false;
  }
    
  validateName(){
    if (!this.authorities){
      this.isAllowedDepartment=true;
      return;
    }
    this.isAllowedDepartment=!!this.authorities.find(f=>f.department==this.authority.department)|| !this.auth.isCoordinator;
    let a=this.authorities.find(f=>f.department===this.authority.department &&
      f.division===this.authority.division && f.board===this.authority.board && f.id !== +this.authority.id );
    this.isAllowedBoard=!a;
    // console.log('In validate name', this.isAllowedDepartment, this.authority, a);
  }

  selectCoord(id: number){
    if (id>0){
      this.user=this.users.find(c=>c.id===id);
      this.searchCoordTerms=this.user.name;  
      this.authority.coordId=(1000+id).toString().substring(1);
    }
    this.showCoordSearchBox=false;
    this.authorityForm.form.controls['searchCoordTerms'].status='VALID';
    return false; // Required
  }
  
  coordBoxIn(){
    this.showCoordSearchBox=true;
  }
  
  update():void {
    if (this.v.validate(this.authorityForm))
    {
      this.dataService.updateAuthority(this.authority).subscribe((data: number)=>{
        this.authority.id=data;
        this.authority=this.authority;  // Current now original
//        this.goBack();
      });
    }
  }  
}