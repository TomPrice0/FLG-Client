import { Component, OnInit } from '@angular/core';
import { DataService} from '../data.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  templateUrl: './welcome.component.html'
})

export class WelcomeComponent {
  constructor(private dataService: DataService, private meta: Meta, private title: Title) { }
  
  public pageTitle = 'Dev build 2020.03.03';

  ngOnInit() {
    this.meta.removeTag("name='keywords'");
    this.meta.removeTag("name='description'");
    this.title.setTitle(`NC Business & Occupational Licensing Database (NCBOLD)`);
    this.meta.addTag({name: "description", content: `North Carolina Business & Occupational License Database (NCBOLD) is a repository for business license information maintained by the North Carolina Department of Commerce. This searchable database enables users to gather information pertaining to North Carolina business, occupational and privilege licensing requirements. Searching by license title and filtering by license type will provide the user with valuable information such as agency contact, license requirements, links to applications and inter-state licensing reciprocity. NCBOLD data is collected annually by the associated agencies, boards and commissions per NC General Statute. Business license data will be used to assist current and potential businesses to successfully start or expand within North Carolina. Occupational data is used in career exploration, workforce applications and will be incorporated with the NCCareer.org website. Please check with your local City, County or Municipality for area specific license requirements they may have.`});        
 
    this.dataService.getAllLicenses().subscribe(data=>{
 //     console.log(data);
    });
  }
}
