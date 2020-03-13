import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListHelperService {

  constructor() { }

  public list: string;
  public default: string;
  public array: any;
  
  get orderDesc(): boolean{
    return sessionStorage.getItem(this.list+'Desc')=='1'||false;
  }
  set orderDesc(val: boolean){
    sessionStorage.setItem(this.list+'Desc',val?'1':'0');
  }
  get listOrder(): string{
    return sessionStorage.getItem(this.list+'Order')||this.default;
  }
  set listOrder(val: string){
  //  console.log(this.listOrder, val);
    if (val==this.listOrder)
      this.orderDesc=!this.orderDesc;
    else {
      sessionStorage.setItem(this.list+'Order',val);
      this.orderDesc=false;
    }
  }

  setOrder(name: string)
  {
    this.listOrder=name;
    if (typeof(this.array[0][name])=="string"){
      if (this.orderDesc)
        this.array.sort((a,b) => a[name].localeCompare(b[name])).reverse();
      else
        this.array.sort((a,b) => a[name].localeCompare(b[name]));
    }
    else {
      if (this.orderDesc)
        this.array.sort((a,b) => b[name]-a[name]);
      else
        this.array.sort((a,b) => a[name]-b[name]);
    }
  }
}
