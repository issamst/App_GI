import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt'
import { TokenApiModel } from '../models/token-api.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl:string="https://localhost:7181/api/User/";
  private userPayload:any;
  constructor(private http:HttpClient,private router:Router) {

    this.userPayload = this.decodedToken();
   }

   signUp(userObj:any){
    return this.http.post<any>(this.baseUrl+'register',userObj);
   }

   Addnew(userObj:any){
    return this.http.post<any>(this.baseUrl+'AddNew',userObj);
   }
   login(loginObj:any){
    return this.http.post<any>(this.baseUrl+'authenticate',loginObj);

   }
   Request(id:any){
    return this.http.get<any>(`${this.baseUrl+'request'}/${id}`);
  

   }
    signOut(){
     localStorage.clear();
     this.router.navigate(['login'])
    }
   storeToken(tokenValue:string){
   
    localStorage.setItem('usertoken',tokenValue)
   }
   
   getToken() {

    return localStorage.getItem('usertoken');
  }
  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'getUserbyid/' + userId);
  }
  updateUser(userId: number, updatedUserData: any): Observable<any> {
    return this.http.put<any>(this.baseUrl + 'updateUser/' + userId, updatedUserData);
  }

  deleteUser(userId: number,comementer :string): Observable<any> {
    return this.http.delete<any>(this.baseUrl + 'deleteUser/' + userId+'/'+comementer);
  }

  storeRefreshToken(tokenValue: string){
    localStorage.setItem('refreshToken', tokenValue)
  }

  getRefreshToken(){
    return localStorage.getItem('refreshToken')
  }

  isLoggedIn(): boolean{
    return !!localStorage.getItem('usertoken')
   }
   decodedToken(){
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    console.log(jwtHelper.decodeToken(token))
    return jwtHelper.decodeToken(token)
  }

  getfullNameFromToken(){
    if(this.userPayload)
    return this.userPayload.unique_name;
  }

  getRoleFromToken(){
    if(this.userPayload)
    return this.userPayload.role;
  }
  renewToken(tokenApi: TokenApiModel) {
    return this.http.post<any>(this.baseUrl + 'refresh', tokenApi);
  }
  //--------------------************----------------

  





}
