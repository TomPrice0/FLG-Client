import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../data.service';
import stateData from '../../shared/states.json';
import { Location } from '@angular/common';
import { Student, StudentResolved, newStudent } from '../student';
import { AuthService } from '../../users/auth.service';
import { HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { Enum } from '../enum';
import { User } from 'src/app/users/user';
import { Validator } from '../../shared/validator';
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'pm-student-edit.detail',
  templateUrl: './student-edit.component.html',
  styleUrls: ['./student-edit.component.scss']
})
export class StudentEditComponent implements OnInit{
   
  boards;
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
    {name: 'types', col: 'studentType', label: 'student Type:', sel: '--Please select'},
   ];

  feeFields=[
     {name: 'applicationFee', label: 'Application fee', prop: 'applicationfee'},
   ];
  numDepts: any;
     
  // https://stackoverflow.com/questions/54889941/how-to-use-math-min-or-math-max-syntax-in-angular-template
  get math() {
    return Math;
  }

  currentstudent:Student;
  originalstudent:Student;
  get student():Student {
    return this.currentstudent;
  }
  set student(value:Student) {
    this.currentstudent = value;
    // Clone the object to retain a copy
    this.originalstudent = value ? { ...value } : null;
  }

  get isDirty(): boolean {
    return JSON.stringify(this.originalstudent) !== JSON.stringify(this.currentstudent);
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
          this.getStudent(id);
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
   }
  
  getStudent(id:number)
  {    
    this.dataService.getAll('board').subscribe(data=>{
      this.boards=data;
      this.boards.forEach(a=>a.name=a.department+(a.division!==''?'/':'')+a.division+(a.board!==''?'/':'')+a.board);
 //     console.log(this.boards);
      if (id==0){
        this.student=newStudent();
        this.student.department=this.boards[0].name;
        this.student=this.student;
      }
      else {
        this.dataService.getStudent(id).subscribe((data: Student)=>{
          this.student = data;
          if (!this.student)
            this.router.navigateByUrl('/**');
          this.title.setTitle(`Editing ${this.student.licTitle}`);
          // TODO: Workaround code - combined auth name temporarily resides in department 02/11/20
          this.student.department=this.student.department+(this.student.division!==''?'/':'')+this.student.division+(this.student.board!==''?'/':'')+this.student.board;
          this.student.recipStates=[];
          if (this.student.reciprocity)
            this.student.reciprocity.split(',').forEach(x=>this.student.recipStates.push(x));
          this.student.tagList=[];
          if (this.student.keywords)
            this.student.keywords.split('~').forEach(x=>this.student.tagList.push(x));      
          this.originalstudent=JSON.parse(JSON.stringify(this.student));
          this.licListPtr=this.licList.findIndex(x=>x===id);
          this.isAllowedName=true;
          this.socSearchTerms=(this.student.socCode && this.student.socTitle)?this.student.socCode+' '+this.student.socTitle:null
      //    console.log(this.student);
        });
      }
    });    
  }

  @HostListener('window:beforeunload')
    canDeactivate(): Observable<boolean> | boolean {  
        return !this.isDirty;
    }

  @ViewChild('licForm', {static: false}) studentForm: any;   

  setAuthid(id: number) {
    let authority=this.boards.find(x=>x.id==id);
    if (!authority)
      return false;
    this.student.licAuthId=(1000+id).toString().substring(1);
    this.student.department=authority.name;
//    console.log(authority);
    this.student.authPhone=authority.telephone;
    this.student.authExt=authority.teleExt;
    this.student.authEmail=authority.email;
    this.student.url=authority.url;
    this.student.contact=authority.contact;
    this.dataService.getUser(authority.coordId).subscribe((data: User)=>{
      let coordinator=data;
      this.student.coordName=coordinator.lastName+', '+coordinator.firstName;
      this.student.coordEmail=coordinator.email;
      this.student.coordPhone=coordinator.telephone;
      this.student.coordExt=coordinator.teleExt; 
    })
    this.showDepartmentSearchBox=false;
    this.isAllowedName=true;
    return false;
  }

  resetAuthid(event) {
    if (event.key=='Escape')
      this.setAuthid(+this.student.licAuthId);
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
      this.student.socDesc=data['socDesc'];
    });
    this.student.socCode=soccode.socCode;
    this.student.socTitle=soccode.socTitle;
    this.socSearchTerms=soccode.socCode+' '+soccode.socTitle;
    this.showSocSearchBox=false;
  }
  
  update():void {
    if (this.v.validate(this.studentForm)){
//      console.log('In update');
      if (this.student.tagList){
        this.student.keywords=this.student.tagList.map(k=>k.display).join('~');
//        console.log(this.student.keywords);
      } 
      if (this.student.recipStates){
        this.student.reciprocity=this.student.recipStates.map(k=>k.value).join(',');
//        console.log(this.student.reciprocity);
      }  
      this.dataService.updateStudent(this.student).subscribe((data: number)=>{
        this.student.id=data;
        this.student=this.student; 
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
    const terms=this.student.department.split(' ');
    return terms.every((term)=>{if (term.length==0) return true;
      let re=new RegExp(term, 'gi'); return name.match(re);}); 
  }
  
  validateName(){
//    console.log('validateName',this.boards, this.student.department);
    this.isAllowedName=!!this.boards.find(f=>f.name==this.student.department);
    //console.log('In validate name', this.isAllowedName, this.student, a);
  }

  goBack() {
    this._location.back();
  }  
}