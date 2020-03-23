import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../data.service';
import { AuthService } from '../../users/auth.service';
import { Location } from '@angular/common';
import stateData from '../../shared/states.json';
import { Board, newBoard } from '../board';
import { HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { UserList } from 'src/app/users/user-list/user-list';
import { Validator } from '../../shared/validator';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'pm-board-edit',
  templateUrl: './board-edit.component.html',
  styleUrls: ['./board-edit.component.css']
})
export class BoardEditComponent implements OnInit {

  boards: Board[];
  authList: number[];
  authListPtr: number;
  currentBoard: Board;
  originalBoard: Board;
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

  get board() {
    return this.currentBoard;
  }
  set board(value) {
    this.currentBoard = value;
    // Clone the object to retain a copy
    this.originalBoard = value ? { ...value } : null;
  } 
  
  constructor(public auth: AuthService, private dataService: DataService, private route: ActivatedRoute, private router:Router,
    private _location: Location, public v: Validator, private title: Title) { }

  ngOnInit() { 
    this.route.params.subscribe(
      params => {
          const id = +params['id'];
          this.getBoard(id);
      }
    );
    
    let list=sessionStorage.getItem('authlist');
    if (list){      
      this.authList=JSON.parse(list);      
    }
    this.states=stateData;
    const id=this.route.snapshot.params['id'];
    this.dataService.getAllBoards().subscribe((data: Board[])=>{
      this.boards = data;
  //    console.log(data);
      this.getBoard(id);
    });
  }

  getBoard(id){
    if (+id===0){
      this.isAddMode=true;
      this.board=newBoard();      
      if (this.boards){
        const uniqueDept = [...new Set(this.boards.map(a=>a.department))];
        if (uniqueDept.length==1)
          this.board.department=this.boards[0].department;
      //  this.board.division=this.boards[0].division;     // Nicole request 01/31/20
      }
      if (this.boardForm){
//        console.log(this.boardForm.form.controls)
        this.boardForm.form.controls['searchCoordTerms'].status='INVALID';
      }
      this.validateName();     
//      console.log(this.board);
    }
    else {
      this.dataService.getBoard(id).subscribe((data: Board)=>{
        if (!data)
          this.router.navigateByUrl('/**');
        this.board=data;
        this.title.setTitle(`Editing ${this.board.department}/${this.board.division}/${this.board.board}`);
        this.validateName();
        this.authListPtr=this.authList.findIndex(x=>x===+id);
        if (this.users)
          this.selectCoord(+this.board.coordId);
      })
    };
  }  

  resetCoordId(event) {
    if (event.key=='Escape')
      this.selectCoord(+this.board.coordId);
  }

  @HostListener('window:beforeunload')
    canDeactivate(): Observable<boolean> | boolean {  
        return !this.isDirty;
    }

  @ViewChild('authForm', {static: false}) boardForm: any;

  get isDirty(): boolean {
//    console.log(this.originalboard,this.currentboard);
    return JSON.stringify(this.originalBoard) !== JSON.stringify(this.currentBoard);
  }

  deleteAuth(){
    if (confirm ("Are you sure?")){
      this.dataService.deleteBoard(this.board.id).subscribe(()=>{
        const n=this.authList.indexOf(this.board.id);
        if (n>=0 && this.authList.length>1)
          this.authList.splice(n,1);
        this.goBack();}
      );
    }
  }

  getDepartment(){
    return this.boards.map(a=>a.department);
  }

  getDivision(){
    return this.boards.filter(a=>a.department==this.board.department).map((a)=>a.division); 
  }

  goBack() {
    this._location.back();
  }

  filterDepartmentResults (name: any){
    const re=new RegExp(this.board.department, 'gi');    
    return name.match(re);
  }

  // Almost identical to filterDepartmentResults
  filterDivisionResults (name: string){
    const re=new RegExp(this.board.division, 'gi');    
    return name.match(re);
  }  
  
  filterCoordResults (user: any){
    const re=new RegExp(this.searchCoordTerms, 'gi');
    return user.name.match(re);
  }

  selectDepartment(department: string)
  {
    this.board.department=department;
    let a=this.boards.find(c=>c.department===department);
    if (a){
      this.board.division=a.division;
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
    this.board.division=division;
    this.showDivisionSearchBox=false;
    return false; // Apparently needed but why? 02/01/20
  }

  hideSearchBoxes(){
    this.showDepartmentSearchBox=false;
    this.showDivisionSearchBox=false;
    this.showCoordSearchBox=false;
  }
    
  validateName(){
    if (!this.boards){
      this.isAllowedDepartment=true;
      return;
    }
    this.isAllowedDepartment=!!this.boards.find(f=>f.department==this.board.department);
    let a=this.boards.find(f=>f.department===this.board.department &&
      f.division===this.board.division && f.board===this.board.board && f.id !== +this.board.id );
    this.isAllowedBoard=!a;
    // console.log('In validate name', this.isAllowedDepartment, this.board, a);
  }

  selectCoord(id: number){
    if (id>0){
      this.user=this.users.find(c=>c.id===id);
      this.searchCoordTerms=this.user.name;  
      this.board.coordId=(1000+id).toString().substring(1);
    }
    this.showCoordSearchBox=false;
    this.boardForm.form.controls['searchCoordTerms'].status='VALID';
    return false; // Required
  }
  
  coordBoxIn(){
    this.showCoordSearchBox=true;
  }
  
  update():void {
    if (this.v.validate(this.boardForm))
    {
      this.dataService.updateBoard(this.board).subscribe((data: number)=>{
        this.board.id=data;
        this.board=this.board;  // Current now original
//        this.goBack();
      });
    }
  }  
}