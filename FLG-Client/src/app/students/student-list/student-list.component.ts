import { Component, OnInit, HostListener } from '@angular/core';
import { DataService } from '../../data.service';
import { Student, StudentResolved } from '../student';
import { AuthService } from '../../users/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Board } from 'src/app/boards/board';
import { Enum } from '../enum';
import { User } from 'src/app/users/user';
import { Observable } from 'rxjs';
import { ListHelperService } from 'src/app/shared/list-helper.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'pm-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css'],  
})
export class StudentListComponent implements OnInit {
  students : Student[];
  boardId: number;
  authName: string;
  coordId: string;
  coordName: string;
  errorMessage: string;  
  filterActive: string='';
  enums: any; 

  cols=[
    {name: "userName", label: "User Name"},
    {name: "name", label: "Student name"},
    {name: "primaryPhone", label: "Phone"},
    {name: "BirthDate", label: "Birth Date"},
    {name: "ActiveDate", label: "Active"},
    {name: "flags", label: "Status flags"},    
  ];
  
  terms: string[];

  get searchTerms(): string{
    let val=sessionStorage.getItem('studentSearchTerms')||'';
    this.terms=val.split(' '); // Needed? 02/02/20
    return val;
  }
  set searchTerms(val: string) {
    this.terms=val.split(' '); 
    sessionStorage.setItem('studentSearchTerms', val);
  }

  constructor(private dataService: DataService, public auth: AuthService, private route: ActivatedRoute, 
    public lh: ListHelperService, private meta: Meta,  private title: Title ) { }
  
  ngOnInit() {
    this.lh.list='student';
    this.lh.default='name';
    this.meta.removeTag("name='keywords'");
    this.meta.removeTag("name='description'");
    this.title.setTitle(`All students`);
    this.route.data.subscribe(data => {
      console.log(data);
      const students: any = data.resolvedData;
//      this.errorMessage = students.error;
      this.students = students.student;
      this.lh.array = this.students;
      this.lh.orderDesc=!this.lh.orderDesc;
      this.lh.setOrder(this.auth.isLoggedIn?this.lh.listOrder:this.lh.default);
      this.boardId=this.route.snapshot.params['boardid'];  
      if (this.boardId){
          this.dataService.getBoard(this.boardId).subscribe((data: Board)=>{ 
          this.authName=data.department+(!data.division ||data.division===''?'':'/'+data.division)+(!data.board || data.board===''?'':'/'+data.board);  
        });
      }
      this.coordId=this.route.snapshot.params['coordid'];  
      if (this.coordId){
          this.dataService.getUser(this.coordId).subscribe((data: User)=>{ 
          this.coordName=data.lastName+', '+data.firstName;  
        });
      }   
    });
  }

  @HostListener('window:beforeunload')
    canDeactivate(): Observable<boolean> | boolean {
        this.saveList();  
        return true;
  }
  
  // Match added options in status selector, 255=all bits
  private filterMask={
    "o": 1,
    "t": 2,
    "x": 4,
    "n": 8,
    "0": 255,
    "z": 255
  };

  filterResults (student: any){
    if (this.auth.isLoggedIn) {
      return true; 
   //   (!this.authId || student.authid==this.authId) &&
   //       (!this.coordId || student.coordid==this.coordId) &&
   //       ( this.filterActive=='' || this.filterActive==student.activeStatus || student.flags&this.filterMask[this.filterActive]) &&
   //      this.terms.every((term)=>{if (term.length==0) return true; let re=new RegExp(term, 'gi'); return student.name.match(re)||student.keywords.match(re);});
    }
    else return this.terms.every((term)=>{if (term.length==0) return true; let re=new RegExp(term, 'gi'); return student.name.match(re)||student.keywords.match(re);});   
  }

  filterEnum (name: string){
    return this.enums.filter(e=>e.name==name);
  }

  getEnumVal(name: string, key: string){
    return this.enums.find(f=>f.name==name && f.key==key).value;
  }

  getStatusIcon(status: string){
    if (status=='1')
      return {color: "red",icon:"user-times"};
    if (status=='2')
      return {color: "darkkhaki",icon:"arrows-alt-h"};
    if (status=='3')
      return {color: "teal",icon:"trash-alt"};
    return {};
  }

  flagLabels(flags: number): string[]{
    let rv=[];
    if (flags & 1) rv.push({tip:'Occupation needed',color:"blue",icon: "male"});
    if (flags & 2) rv.push({tip:'License type needed',color:"saddlebrown",icon: "flag"});
    if (flags & 4) rv.push({tip:'Transfer request',color:"orange",icon: "bus"});
    if (flags & 8) rv.push({tip:'students issued needed',color:"green",icon: "inbox"});
    return rv;
  }
  
  saveList() {
    let list=[];
    this.students.forEach(l=> {if (this.filterResults(l))
      list.push(l.id);
    });
    sessionStorage.setItem("liclist",JSON.stringify(list));
  }  
 }
