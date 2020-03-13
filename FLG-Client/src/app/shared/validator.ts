import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })

export class Validator{

    constructor() { }

    public validate(form): boolean {
        //  console.log(this.test.controls);
        let obj=form.controls;
        let i=0;
        Object.keys(obj).forEach(function(key,index) {
            obj[key].markAsTouched();
        //    console.log(obj[key]);
            if (obj[key].status=='INVALID'){
                console.log(key);
                i++; 
            }
        })    
        return i===0;
    }

    public testLink(url: string){
        const re=new RegExp('^https?://', 'gi');
        if (!url.match(re))
          url='http://'+url;
        window.open(url,'_blank','resizable,height=260,width=370');
        return url;    
    }    
}
