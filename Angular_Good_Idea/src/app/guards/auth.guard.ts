import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth : AuthService, private router: Router, private toast: NgToastService){}
  canActivate():boolean{
    if(this.auth.isLoggedIn()){
      return true
    }else{
     
       Swal.fire('Hi how are you !! ', 'Please Login First!', 'error')

       this.router.navigate(['login'])
       return false;
    }
  }

}
