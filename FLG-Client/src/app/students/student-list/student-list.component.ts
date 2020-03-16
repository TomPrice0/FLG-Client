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
  licenses : Student[];
  authId: number;
  authName: string;
  coordId: string;
  coordName: string;
  errorMessage: string;  
  filterActive: string='';
  enums: any; 

  cols=[
    {name: "licTitle", label: "License"},
    {name: "licenseUpdated", label: "Updated"},
    {name: "flags", label: "Status flags"},    
  ];
  
  terms: string[];

  get searchTerms(): string{
    let val=sessionStorage.getItem('licSearchTerms')||'';
    this.terms=val.split(' '); // Needed? 02/02/20
    return val;
  }
  set searchTerms(val: string) {
    this.terms=val.split(' '); 
    sessionStorage.setItem('licSearchTerms', val);
  }

  constructor(private dataService: DataService, public auth: AuthService, private route: ActivatedRoute, 
    public lh: ListHelperService, private meta: Meta,  private title: Title ) { }
  
  ngOnInit() {
    this.lh.list='lic';
    this.lh.default='licTitle';
    this.meta.removeTag("name='keywords'");
    this.meta.removeTag("name='description'");
    this.title.setTitle(`All licenses required by state statutes in North Carolina`);
    this.meta.addTag({name: "description", content: `North Carolina Business & Occupational License Database (NCBOLD) is a repository for business license information maintained by the North Carolina Department of Commerce. This searchable database enables users to gather information pertaining to North Carolina business, occupational and privilege licensing requirements. Searching by license title and filtering by license type will provide the user with valuable information such as agency contact, license requirements, links to applications and inter-state licensing reciprocity. NCBOLD data is collected annually by the associated agencies, boards and commissions per NC General Statute. Business license data will be used to assist current and potential businesses to successfully start or expand within North Carolina. Occupational data is used in career exploration, workforce applications and will be incorporated with the NCCareer.org website. Please check with your local City, County or Municipality for area specific license requirements they may have.`});        
    if (this.auth.isLoggedIn){!
      this.dataService.getEnum().subscribe((data: Enum[])=>{
        this.enums=data;
      });
    }    
    this.route.data.subscribe(data => {
//      console.log(data);
      const licenses: any = data.resolvedData;
//      this.errorMessage = licenses.error;
      this.licenses = licenses.license;
      this.lh.array = this.licenses;
      this.lh.orderDesc=!this.lh.orderDesc;
      this.lh.setOrder(this.auth.isLoggedIn?this.lh.listOrder:this.lh.default);
      this.authId=this.route.snapshot.params['authid'];  
      if (this.authId){
          this.dataService.getAuthority(this.authId).subscribe((data: Board)=>{ 
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

  filterResults (license: any){
    if (this.auth.isLoggedIn) {
      return (!this.authId || license.authid==this.authId) &&
          (!this.coordId || license.coordid==this.coordId) &&
          ( this.filterActive=='' || this.filterActive==license.activeStatus || license.flags&this.filterMask[this.filterActive]) &&
         this.terms.every((term)=>{if (term.length==0) return true; let re=new RegExp(term, 'gi'); return license.licTitle.match(re)||license.keywords.match(re);});
    }
    else return this.terms.every((term)=>{if (term.length==0) return true; let re=new RegExp(term, 'gi'); return license.licTitle.match(re)||license.keywords.match(re);});   
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
    if (flags & 1 && !this.auth.isCoordinator) rv.push({tip:'Occupation needed',color:"blue",icon: "male"});
    if (flags & 2 && !this.auth.isCoordinator) rv.push({tip:'License type needed',color:"saddlebrown",icon: "flag"});
    if (flags & 4) rv.push({tip:'Transfer request',color:"orange",icon: "bus"});
    if (flags & 8) rv.push({tip:'Licenses issued needed',color:"green",icon: "inbox"});
    return rv;
  }
  
  saveList() {
    let list=[];
    this.licenses.forEach(l=> {if (this.filterResults(l))
      list.push(l.id);
    });
    sessionStorage.setItem("liclist",JSON.stringify(list));
  }  
 }
