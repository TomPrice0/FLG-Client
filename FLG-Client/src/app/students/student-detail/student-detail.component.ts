import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../data.service';
import { Student } from '../student';
import { Meta, Title } from "@angular/platform-browser";
import { Enum } from '../enum';

@Component({
  selector: 'pm-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent implements OnInit {
  student: Student;
  studentList: number[];
  studentListPtr: number;
  //errorMessage: any;
  enums: Enum[];
  enumFields=[
    {name: 'edu', col: 'education', label: 'Education:'},
    {name: 'cert', col: 'certification', label: 'Certification:'},
    {name: 'cedu', col: 'continuingedu', label: 'Continuing education:'},
    {name: 'exp', col: 'experience', label: 'Experience:'},
    {name: 'exam', col: 'exam', label: 'Exam:'},
    {name: 'crim', col: 'criminal', label: 'Criminal:'},
    {name: 'phy', col: 'physical', label: 'Physical requirements:'},
    {name: 'vet', col: 'veteran', label: 'Veteran:'},
    {name: 'active', col: 'inactive', label: 'Active status:'},
    {name: 'types', col: 'studentType', label: 'student Type:'},
   ];
  
  // https://stackoverflow.com/questions/54889941/how-to-use-math-min-or-math-max-syntax-in-angular-template
  get math() {
    return Math;
  }
  constructor(private dataService: DataService, private route: ActivatedRoute, private meta: Meta,
      private title: Title) { }

  ngOnInit() {    
    this.route.params.subscribe(
      params => {
          const id = +params['id'];
          this.getStudent(id);
      }
    );    
    let list=sessionStorage.getItem('studentlist');
    if (list){      
      this.studentList=JSON.parse(list);
    }
    this.dataService.getEnum().subscribe((data: Enum[])=>{
      this.enums=data;
    });
  }

  getStudent(id){
    this.dataService.getStudent(id).subscribe((data: Student)=>{
      this.student = data;
      this.studentListPtr=this.studentList.findIndex(x=>x===id);
      // Title and meta set for Googlebot/SEO
      this.meta.removeTag("name='keywords'");
      this.meta.removeTag("name='description'");
      if (!!this.student.keywords){
        this.meta.addTag({name: "keywords", content: this.student.keywords.toLowerCase().replace("~",", ")});
      }
      if (!!this.student.socTitle){
        this.meta.addTag({name: "description", content: `applying for an occupational student for ${this.student.socCode} ${this.student.socTitle.toLowerCase()} in North Carolina`});        
      }
      this.title.setTitle(`Activity for ${this.student.licTitle} in North Carolina`);
    }) 
  }

  getEnums(){
    return this.enumFields.filter(e=>!!this.student[e.col]); 
  }  

  getEnumVal(name: string, key: string){
    return this.enums.find(f=>f.name==name && f.key==key).value;
  }
}
