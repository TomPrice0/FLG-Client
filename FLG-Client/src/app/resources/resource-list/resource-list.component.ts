import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { AuthService } from '../../users/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ListHelperService } from 'src/app/shared/list-helper.service';
import { Resource } from '../resource';

@Component({
  selector: 'pm-resource-list',
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.css']
})
export class ResourceListComponent implements OnInit {
 
  resources=[];
  errorMessage;
  cols=[
    {name: "title", label: "Resource"},
    {name: "updateddate", label: "Last Revision"},
    {name: "updatedby", label: "Updated by"},
  ];

  get searchTerms(): string{
    return sessionStorage.getItem('resSearchTerms')||'';
  }
  set searchTerms(val: string) {
    sessionStorage.setItem('resSearchTerms', val);
  }
    
  constructor(private auth: AuthService, private dataService: DataService, private route: ActivatedRoute,
    public lh: ListHelperService) { }
  
  ngOnInit() {
    this.lh.list='resources';
    this.lh.default='title';
    this.dataService.getAll('resource').subscribe((data: any)=>{
        console.log(data);
        this.resources = data;
        this.lh.array=this.resources;
        this.lh.orderDesc=!this.lh.orderDesc;
        this.lh.setOrder(this.lh.listOrder);
    }) 
  }

  filterResults (resource: any){
    let terms=this.searchTerms.split(' ');
    return terms.every((term)=>{if (term.length==0) return true;
      let re=new RegExp(term, 'gi'); return resource.title.match(re)|| resource.tags.match(re);});   
  }

  composeEmail(id: number) {
    this.dataService.getEntity('resource',id).subscribe((data: Resource)=>{
      window.open("mailto:?subject=Requested licensing information&body="+data.resource);
    });
  }

  saveList() {
    let list=[];
    this.resources.forEach(a=> {if (this.filterResults(a))
      list.push(a.id);
    });
    sessionStorage.setItem("reslist",JSON.stringify(list));
  }
}
