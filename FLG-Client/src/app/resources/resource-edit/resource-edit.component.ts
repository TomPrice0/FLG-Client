import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../data.service';
import { Location } from '@angular/common';
import { Resource, newResource } from '../resource';
import { AuthService } from '../../users/auth.service';
import { HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { Validator } from '../../shared/validator';

@Component({
  selector: 'pm-resource-edit',
  templateUrl: './resource-edit.component.html',
  styleUrls: ['./resource-edit.component.scss']
})

export class ResourceEditComponent implements OnInit {

  resList=[];
  resListPtr: number;
  initId: number;
  currentResource: Resource;
  originalResource: Resource;

  get resource():Resource {
    return this.currentResource;
  }
  set resource(value:Resource) {
    this.currentResource = value;
    // Clone the object to retain a copy
    this.originalResource = value ? { ...value } : null;
  }

  goBack() {
    this._location.back();
  }

  // https://stackoverflow.com/questions/54889941/how-to-use-math-min-or-math-max-syntax-in-angular-template
  get math() {
    return Math;
  }


  get isDirty(): boolean {
    return JSON.stringify(this.originalResource) !== JSON.stringify(this.currentResource);
  }
  
  constructor(private dataService: DataService, public auth: AuthService, private route: ActivatedRoute, 
    private router: Router, private _location: Location, private v: Validator) { }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
          const id = +params['id'];
          this.initId=id;
          if (+id>0){
            this.getResource(id);      
          }
          else {
            this.resource=newResource();
  //          console.log(this.resource);  
          } 
      });
    let list=sessionStorage.getItem('reslist');
    if (list){ 
      this.resList=JSON.parse(list);
    }
    const id=this.route.snapshot.params['id'];
    console.log(id);

  }

  getResource(id){
   this.dataService.getResource(id).subscribe((data: Resource)=>{
      //       console.log(data);      
      this.resource = data;
      if (!this.resource)
        this.router.navigateByUrl('/**');
      this.resListPtr=this.resList.findIndex(x=>x===+id);
      this.resource.tagList=[];
      if (this.resource.tags)
        this.resource.tags.split('~').forEach(x=>this.resource.tagList.push(x));      
      this.resource=this.resource;     
    });
  }

  @HostListener('window:beforeunload')
    canDeactivate(): Observable<boolean> | boolean {  
        return !this.isDirty;
    }

  @ViewChild('resForm', {static: false}) resourceForm: any;

  update():void {
    if (this.v.validate(this.resourceForm)){
      if (this.resource.tagList)
        this.resource.tags=this.resource.tagList.map(k=>k.display).join('~');
      this.dataService.updateResource(this.resource).subscribe((data: number)=>{
  //      console.log(data);
        this.resource.id=data;
        this.resource=this.resource;  // Resets base for dirty
      });
    }
  }

  delete():void{
    if (confirm ("Are you sure?")){
      this.dataService.deleteResource(this.resource.id).subscribe(()=>{
        const n=this.resList.indexOf(this.resource.id);
        if (n>=0 && this.resList.length>1)
          this.resList.splice(n,1);
        this.goBack();
      });
    }
  }
}
