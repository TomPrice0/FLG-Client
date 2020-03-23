import { Component, OnInit } from '@angular/core';
import { DataService} from '../data.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  templateUrl: './welcome.component.html'
})

export class WelcomeComponent {
  constructor(private dataService: DataService, private meta: Meta, private title: Title) { }
  
  public pageTitle = 'Dev build 2020.03.21';

  ngOnInit() {
    this.meta.removeTag("name='keywords'");
    this.meta.removeTag("name='description'");
    this.title.setTitle(`NC Finish Line Grants`);    
 //   this.dataService.getAllStudents().subscribe(data=>{
 //     console.log(data);
//    });
  }
}
