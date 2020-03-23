import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError, publishReplay, refCount, map } from 'rxjs/operators';
import { Student } from './students/student';
import { User } from './users/user';
import { Board } from './boards/board';
import { Resource } from './resources/resource';

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

  public getAllStudents(){
    return this.httpClient.get(`${this.REST_API_SERVER}/student`).pipe(catchError(this.handleError));
  }

  public getStudent(studentId: number){
    return this.httpClient.get(this.REST_API_SERVER+'/student/'+studentId).pipe(catchError(this.handleError));
  }

  public updateStudent(l: Student) {
    this.cache['liclist']=null;   
    return this.httpClient.post(this.REST_API_SERVER+'/student',l).pipe(catchError(this.handleError));
  }

  public getAllBoards(){
    return this.getCachedData('authlist',this.REST_API_SERVER+'/board').pipe(catchError(this.handleError));
  }  

  public getBoard(boardId: number){
    return this.httpClient.get(this.REST_API_SERVER+'/board/'+boardId.toString()).pipe(catchError(this.handleError));
  } 

  public deleteBoard(boardId: number){
    this.cache['board']=null;
    return this.httpClient.delete(this.REST_API_SERVER+'/board/'+boardId.toString()).pipe(catchError(this.handleError));
  } 

  public updateBoard(a: Board){
    this.cache['board']=null;
    return this.httpClient.post(this.REST_API_SERVER+'/board/',a).pipe(catchError(this.handleError));
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
  
