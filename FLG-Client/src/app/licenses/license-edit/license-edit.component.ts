import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../data.service';
import stateData from '../../shared/states.json';
import { Location } from '@angular/common';
import { License, LicenseResolved, newLicense } from '../license';
import { AuthService } from '../../users/auth.service';
import { HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { Enum } from '../enum';
import { User } from 'src/app/users/user';
import { Validator } from '../../shared/validator';
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'pm-license-edit.detail',
  templateUrl: './license-edit.component.html',
  styleUrls: ['./license-edit.component.scss']
})
export class LicenseEditComponent implements OnInit{
   
  authorities;
  enum: Enum[];
  coordinator: User;
  socSearchTerms: string='';
  soccodes;
  states=[];
  licList: number[];
  licListPtr: number;
  dataIsValid;                     // To delete;
  errorMessage: string;
  isAllowedName: boolean;
  showDepartmentSearchBox: boolean;
  showSocSearchBox: boolean;
  enumFields=[
    {name: 'edu', col: 'education', label: 'Education:', sel: '--Please select'},
    {name: 'cert', col: 'certification', label: 'Certification:', sel: '--Please select'},
    {name: 'cedu', col: 'continuingedu', label: 'Continuing education:', sel: '--Please select'},
    {name: 'exp', col: 'experience', label: 'Experience:', sel: '--Please select'},
    {name: 'exam', col: 'exam', label: 'Exam:', sel: '--Please select'},
    {name: 'crim', col: 'criminal', label: 'Criminal:', sel: '--Please select'},
    {name: 'phy', col: 'physical', label: 'Physical requirements:', sel: '--Please select'},
    {name: 'vet', col: 'veteran', label: 'Veteran:', sel: '--Please select'},
    {name: 'active', col: 'inactive', label: 'Active status:', sel: '--Please select'},
    {name: 'types', col: 'licenseType', label: 'License Type:', sel: '--Please select'},
   ];

  feeFields=[
     {name: 'applicationFee', label: 'Application fee', prop: 'applicationfee'},
   ];
  numDepts: any;
     
  // https://stackoverflow.com/questions/54889941/how-to-use-math-min-or-math-max-syntax-in-angular-template
  get math() {
    return Math;
  }

  currentLicense:License;
  originalLicense:License;
  get license():License {
    return this.currentLicense;
  }
  set license(value:License) {
    this.currentLicense = value;
    // Clone the object to retain a copy
    this.originalLicense = value ? { ...value } : null;
  }

  get isDirty(): boolean {
    return JSON.stringify(this.originalLicense) !== JSON.stringify(this.currentLicense);
  }

  isValid(path?: string): boolean {
    if (path) {
      return this.dataIsValid[path];
    }
    return (this.dataIsValid &&
      Object.keys(this.dataIsValid).every(d => this.dataIsValid[d] === true));
  }

  get issuedYr(): number {
    const curDate=new Date();
    return curDate.getFullYear()-(curDate.getMonth()<2?3:2);
  }

  constructor(private dataService: DataService, public auth: AuthService, private route: ActivatedRoute, 
      private router: Router, private _location: Location, public v: Validator, private title: Title) { }

  ngOnInit() { 
    this.route.params.subscribe(
      params => {
          const id = +params['id'];
          this.getLicense(id);
      }
    );
    let list=sessionStorage.getItem('liclist');
    if (list){      
      this.licList=JSON.parse(list);
    }
    this.dataService.getEnum().subscribe((data: Enum[])=>{
      this.enum=data;
    });
    this.states.push('Nationwide');
    stateData.forEach(s=>{if(s.abbrev!=='NC') this.states.push(s.abbrev)});
    if (this.auth.isLeadAdmin) {
      this.dataService.getSoccodes().subscribe((data)=>{
        this.soccodes=data;
      })
    }
  }
  
  getLicense(id:number)
  {    
    this.dataService.getAllAuthorities().subscribe(data=>{
      this.authorities=data;
      this.authorities.forEach(a=>a.name=a.department+(a.division!==''?'/':'')+a.division+(a.board!==''?'/':'')+a.board);
 //     console.log(this.authorities);
      if (id==0){
        this.license=newLicense();
        this.license.department=this.authorities[0].name;
        this.license=this.license;
      }
      else {
        this.dataService.getLicense(id).subscribe((data: License)=>{
          this.license = data;
          if (!this.license)
            this.router.navigateByUrl('/**');
          this.title.setTitle(`Editing ${this.license.licTitle}`);
          // TODO: Workaround code - combined auth name temporarily resides in department 02/11/20
          this.license.department=this.license.department+(this.license.division!==''?'/':'')+this.license.division+(this.license.board!==''?'/':'')+this.license.board;
          this.license.recipStates=[];
          if (this.license.reciprocity)
            this.license.reciprocity.split(',').forEach(x=>this.license.recipStates.push(x));
          this.license.tagList=[];
          if (this.license.keywords)
            this.license.keywords.split('~').forEach(x=>this.license.tagList.push(x));      
          this.originalLicense=JSON.parse(JSON.stringify(this.license));
          this.licListPtr=this.licList.findIndex(x=>x===id);
          this.isAllowedName=true;
          this.socSearchTerms=(this.license.socCode && this.license.socTitle)?this.license.socCode+' '+this.license.socTitle:null
      //    console.log(this.license);
        });
      }
    });    
  }

  @HostListener('window:beforeunload')
    canDeactivate(): Observable<boolean> | boolean {  
        return !this.isDirty;
    }

  @ViewChild('licForm', {static: false}) licenseForm: any;   

  setAuthid(id: number) {
    let authority=this.authorities.find(x=>x.id==id);
    if (!authority)
      return false;
    this.license.licAuthId=(1000+id).toString().substring(1);
    this.license.department=authority.name;
//    console.log(authority);
    this.license.authPhone=authority.telephone;
    this.license.authExt=authority.teleExt;
    this.license.authEmail=authority.email;
    this.license.url=authority.url;
    this.license.contact=authority.contact;
    this.dataService.getUser(authority.coordId).subscribe((data: User)=>{
      let coordinator=data;
      this.license.coordName=coordinator.lastName+', '+coordinator.firstName;
      this.license.coordEmail=coordinator.email;
      this.license.coordPhone=coordinator.telephone;
      this.license.coordExt=coordinator.teleExt; 
    })
    this.showDepartmentSearchBox=false;
    this.isAllowedName=true;
    return false;
  }

  resetAuthid(event) {
    if (event.key=='Escape')
      this.setAuthid(+this.license.licAuthId);
  }

  filterEnum (name: string){
    return this.enum.filter(e=>e.name==name);
  }

  filterSocResults (occ: any){
    const terms=this.socSearchTerms.split(' ');
    return terms.every((term)=>{if (term.length==0) return true;
      let re=new RegExp(term, 'gi'); return occ.socCode.match(re) || occ.socTitle.match(re);});    
  }

  setSoccode(occ){
    const soccode=this.soccodes.find(s=>s.socCode===occ);
 //   console.log(this.soccodes);
    this.dataService.getSocdesc(occ).subscribe((data)=>{
 //     console.log(data);
      this.license.socDesc=data['socDesc'];
    });
    this.license.socCode=soccode.socCode;
    this.license.socTitle=soccode.socTitle;
    this.socSearchTerms=soccode.socCode+' '+soccode.socTitle;
    this.showSocSearchBox=false;
  }
  
  update():void {
    if (this.v.validate(this.licenseForm)){
//      console.log('In update');
      if (this.license.tagList){
        this.license.keywords=this.license.tagList.map(k=>k.display).join('~');
//        console.log(this.license.keywords);
      } 
      if (this.license.recipStates){
        this.license.reciprocity=this.license.recipStates.map(k=>k.value).join(',');
//        console.log(this.license.reciprocity);
      }  
      this.dataService.updateLicense(this.license).subscribe((data: number)=>{
        this.license.id=data;
        this.license=this.license; 
      });
    }
  }

  hideSearchBoxes(){
    this.showDepartmentSearchBox=false;
  }

  authorityBoxIn(){
    this.showDepartmentSearchBox=true;
  }

  filterAuthority (name: any){
    const terms=this.license.department.split(' ');
    return terms.every((term)=>{if (term.length==0) return true;
      let re=new RegExp(term, 'gi'); return name.match(re);}); 
  }
  
  validateName(){
//    console.log('validateName',this.authorities, this.license.department);
    this.isAllowedName=!!this.authorities.find(f=>f.name==this.license.department);
    //console.log('In validate name', this.isAllowedName, this.license, a);
  }

  goBack() {
    this._location.back();
  }  
}