import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError, publishReplay, refCount, map } from 'rxjs/operators';
import { Student } from './students/student';
import { User } from './users/user';
import { Board } from './boards/board';
import { College } from './colleges/college'
import { Resource } from './resources/resource';
import { Vendor } from './vendors/vendor';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private REST_API_SERVER = "http://localhost:62469/api"; //2724 //";  //http://tom.ncbold.com/api"; //
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
  
  // Generic test
  public getAll(entity: string){
    return this.getCachedData(entity,this.REST_API_SERVER+'/'+entity).pipe(catchError(this.handleError));
  }

  public getEntity(entity: string, id: number){
    return this.httpClient.get(this.REST_API_SERVER+'/'+entity+'/'+id.toString()).pipe(catchError(this.handleError));
  } 

  public deleteEntity(entity: string, id: number){
    this.cache[entity]=null;
    return this.httpClient.delete(this.REST_API_SERVER+'/'+entity+'/'+id.toString()).pipe(catchError(this.handleError));
  } 

  public updateEntity(entity: string, e: any){
    return this.httpClient.post(this.REST_API_SERVER+'/'+entity+'/'+e.id.toString(),e).pipe(catchError(this.handleError));
  } 
  // End generic test

  public xgetAllBoards(){
    return this.getCachedData('board',this.REST_API_SERVER+'/board').pipe(catchError(this.handleError));
  }  

  public xgetBoard(boardId: number){
    return this.httpClient.get(this.REST_API_SERVER+'/board/'+boardId.toString()).pipe(catchError(this.handleError));
  } 

  public xdeleteBoard(boardId: number){
    this.cache['board']=null;
    return this.httpClient.delete(this.REST_API_SERVER+'/board/'+boardId.toString()).pipe(catchError(this.handleError));
  } 

  public xupdateBoard(b: Board){
    this.cache['board']=null;
    return this.httpClient.post(this.REST_API_SERVER+'/board/',b).pipe(catchError(this.handleError));
  }

  public xgetAllColleges(){
    return this.getCachedData('college',this.REST_API_SERVER+'/college').pipe(catchError(this.handleError));
  }  

  public xgetCollege(collegeId: number){
    return this.httpClient.get(this.REST_API_SERVER+'/college/'+collegeId.toString()).pipe(catchError(this.handleError));
  } 

  public deleteCollege(collegeId: number){
    this.cache['college']=null;
    return this.httpClient.delete(this.REST_API_SERVER+'/college/'+collegeId.toString()).pipe(catchError(this.handleError));
  } 

  public xupdateCollege(c: College){
    this.cache['college']=null;
    return this.httpClient.post(this.REST_API_SERVER+'/college/',c).pipe(catchError(this.handleError));
  }  
 
  public xgetAllResources(){
    return this.getCachedData('reslist',`${this.REST_API_SERVER}/resource`).pipe(catchError(this.handleError));
  }

  public xetResource(id: number){
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

  public getAllStudents(){
    return this.httpClient.get(`${this.REST_API_SERVER}/student`).pipe(catchError(this.handleError));
  }

  public getStudent(studentId: number){
    return this.httpClient.get(this.REST_API_SERVER+'/student/'+studentId).pipe(catchError(this.handleError));
  }

  public updateStudent(s: Student) {
    this.cache['liclist']=null;   
    return this.httpClient.post(this.REST_API_SERVER+'/student',s).pipe(catchError(this.handleError));
  }

  public getAllVendors(){
    return this.getCachedData('authlist',this.REST_API_SERVER+'/college').pipe(catchError(this.handleError));
  }  

  public getVendor(vendorId: number){
    return this.httpClient.get(this.REST_API_SERVER+'/vendor/'+vendorId.toString()).pipe(catchError(this.handleError));
  } 

  public deleteVendor(vendorId: number){
    this.cache['vendor']=null;
    return this.httpClient.delete(this.REST_API_SERVER+'/college/'+vendorId.toString()).pipe(catchError(this.handleError));
  } 

  public updateVendor(v: Vendor){
    this.cache['vendor']=null;
    return this.httpClient.post(this.REST_API_SERVER+'/vendor/',v).pipe(catchError(this.handleError));
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
  
