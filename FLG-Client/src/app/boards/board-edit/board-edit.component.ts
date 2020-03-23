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
  boardList: number[];
  boardListPtr: number;
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
    
    let list=sessionStorage.getItem('boardList');
    if (list){      
      this.boardList=JSON.parse(list);      
    }
    this.states=stateData;
    const id=this.route.snapshot.params['id'];
    this.dataService.getAll('board').subscribe((data: Board[])=>{
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
    }
    else {
      this.dataService.getEntity('board',id).subscribe((data: Board)=>{
        if (!data)
          this.router.navigateByUrl('/**');
        this.board=data;
      //  this.title.setTitle(`Editing ${this.board.department}/${this.board.division}/${this.board.board}`);
        this.boardListPtr=this.boardList.findIndex(x=>x===+id);
      })
    };
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

  goBack() {
    this._location.back();
  }
  
  deleteAuth(){
    if (confirm ("Are you sure?")){
      this.dataService.deleteEntity('board',this.board.id).subscribe(()=>{
        const n=this.boardList.indexOf(this.board.id);
        if (n>=0 && this.boardList.length>1)
          this.boardList.splice(n,1);
        this.goBack();}
      );
    }
  }
  
  update():void {
    if (this.v.validate(this.boardForm))
    {
      this.dataService.updateEntity('board',this.board).subscribe((data: number)=>{
        this.board.id=data;
        this.board=this.board;  // Current now original
//        this.goBack();
      });
    }
  }  
}