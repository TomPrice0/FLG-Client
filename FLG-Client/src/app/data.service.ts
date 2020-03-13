import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError, publishReplay, refCount, map } from 'rxjs/operators';
import { License } from './licenses/license';
import { User } from './users/user';
import { Authority } from './authorities/authority';
import { Resource } from './resources/resource';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private REST_API_SERVER = "http://tom.ncbold.com/api"; //http://localhost:2724/api"; //2724 //";  //
  constructor(private httpClient: HttpClient) { }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unable to connect to host!';
    console.log('Error', error);
    if (error instanceof ErrorEvent) {
      // Client-side errors      
      errorMessage = `Error: ${error.message}`;
    } else {
      if (error.status>0)
      // Server-side errors
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.error}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  public getAllLicenses(){
    return this.getCachedData('liclist',`${this.REST_API_SERVER}/license`).pipe(catchError(this.handleError));
  }

  public getLicense(licenseId: number){
    return this.httpClient.get(this.REST_API_SERVER+'/license/'+licenseId).pipe(catchError(this.handleError));
  }

  public updateLicense(l: License) {
    this.cache['liclist']=null;   
    return this.httpClient.post(this.REST_API_SERVER+'/license',l).pipe(catchError(this.handleError));
  }

  public getAllAuthorities(){
    return this.getCachedData('authlist',this.REST_API_SERVER+'/authority').pipe(catchError(this.handleError));
  }  

  public getAuthority(licAuthId: number){
    return this.httpClient.get(this.REST_API_SERVER+'/authority/'+licAuthId.toString()).pipe(catchError(this.handleError));
  } 

  public deleteAuthority(licAuthId: number){
    this.cache['authority']=null;
    return this.httpClient.delete(this.REST_API_SERVER+'/authority/'+licAuthId.toString()).pipe(catchError(this.handleError));
  } 

  public updateAuthority(a: Authority){
    this.cache['authority']=null;
    return this.httpClient.post(this.REST_API_SERVER+'/authority/',a).pipe(catchError(this.handleError));
  }

  public getAllResources(){
    return this.getCachedData('reslist',`${this.REST_API_SERVER}/resource`).pipe(catchError(this.handleError));
  }

  public getResource(id: number){
    return this.httpClient.get(this.REST_API_SERVER+'/resource/'+id).pipe(catchError(this.handleError));
  }

  public updateResource(r: Resource) {
    this.cache['reslist']=null;   
    return this.httpClient.post(this.REST_API_SERVER+'/resource',r).pipe(catchError(this.handleError));
  }
  
  public deleteResource(id: number) {
    this.cache['reslist']=null;   
    return this.httpClient.delete(this.REST_API_SERVER+'/resource/'+id).pipe(catchError(this.handleError));
  }

  public getSoccodes(){
    return this.getCachedData('soclist',this.REST_API_SERVER+'/soccode').pipe(catchError(this.handleError));
  }
  
  public getSocdesc(soccode: string){
    return this.httpClient.get(this.REST_API_SERVER+'/soccode/'+soccode).pipe(catchError(this.handleError));
  }

  public getEnum() {
    return this.getCachedData('enum',this.REST_API_SERVER+'/enums').pipe(catchError(this.handleError));  
  }

  public getAllUsers(){  
    return this.httpClient.get(this.REST_API_SERVER+'/user').pipe(catchError(this.handleError)); 
  }

  public getUser(coorId: string){ 
    return this.httpClient.get(this.REST_API_SERVER+'/user/'+coorId).pipe(catchError(this.handleError)); 
  }
 
  public updateUser(u: User) {
    return this.httpClient.post(this.REST_API_SERVER+'/user',u).pipe(catchError(this.handleError));
  }

  public login(username, password) {
    this.clearCache();  
    return this.httpClient.post(this.REST_API_SERVER+'/user/createtoken', {"Username": username, "Password": password}).pipe(catchError(this.handleError)); 
  }

  cache={};
  // Adapted from https://medium.com/angular-in-depth/fastest-way-to-cache-for-lazy-developers-angular-with-rxjs-444a198ed6a6
  getCachedData(name: string, url: string): Observable<any> {
    if (!this.cache[name]) {
      this.cache[name] = this.httpClient.get(url).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
      console.log('Real server access '+url);
    }
    else
      console.log('Used cached value '+url);
    return this.cache[name];
  }

  public clearCache(cacheName?: string){
    if (cacheName)
      this.cache[cacheName]=null;
    else
      this.cache={};  // No param, all caches
  }
};       
  
