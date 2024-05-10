import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
  private fullNameKey = 'userFullName';
  private roleKey = 'userRole';
  private fulltName$ = new BehaviorSubject<string>(this.getFullNameFromLocalStorage() || "");
  private role$ = new BehaviorSubject<string>(this.getRoleFromLocalStorage() || "");

  constructor() { }

  public getRoleFromStore(){
    return this.role$.asObservable();
  }
  public getFullNameFromStore(){
    return this.fulltName$.asObservable();
  }
  public setRoleForStore(role:string){
    this.role$.next(role);
    localStorage.setItem(this.roleKey, role);
  }
  public setFullNameForStore(fulltName:string){
    this.fulltName$.next(fulltName)
    localStorage.setItem(this.fullNameKey, fulltName);
  }
  


  private getFullNameFromLocalStorage(): string | null {
    return localStorage.getItem(this.fullNameKey);
  }

  private getRoleFromLocalStorage(): string | null {
    return localStorage.getItem(this.roleKey);
  }
}
