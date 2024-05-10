import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import ValidateForm from '../../helpers/validateform';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import Swal from 'sweetalert2';
import { UserStoreService } from '../../services/user-store.service';
import { Console } from 'node:console';
import { ResetPassword } from '../../models/reset-password.model';
import { ResetPasswordService } from '../../services/reset-password.service';
import { TitleServiceService } from '../../services/title-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  type:string="password";
  isText:boolean=false;
  eyeIcon: string ="fa-eye-slash ";
  loginForm!:FormGroup;
  lang:string ='';
  Notemial:string='';

  ResetPasswordForm!:FormGroup;
  //form html
  public resetPasswordEmail!:string;
  
  public isValidEmail!:boolean;
  isNotOperatorChecked: boolean = false;
  public teID: string = '';
  public isValidTeid!:boolean;
  isValidTEID: boolean = false;
  public titles: any = [];
  constructor(
    private titleService: TitleServiceService,
    private fb:FormBuilder,
    private translateService:TranslateService,
    private auth: AuthService,
    private router:Router,
    private toast: NgToastService,
    private userStore: UserStoreService,
    private resetService:ResetPasswordService
    
    ){
    
  }

  toggleNotOperator() {
    this.isNotOperatorChecked = !this.isNotOperatorChecked;
    if (this.isNotOperatorChecked) {
      // Clear the email field when "Not Operator" checkbox is checked
      this.ResetPasswordForm.get('Email')?.reset('');
    }
  }


  ngOnInit(): void {
    this.titleService.getAllTitle().subscribe((res) => {
      this.titles = res;
    });
    this.loginForm = this.fb.group({
      TEID:['',Validators.required],
      Password:['',Validators.required]
  }),

  this.lang = localStorage.getItem('lang')|| 'en',



  this.ResetPasswordForm = this.fb.group({
    TEID:['',Validators.required],
    Email:['',Validators.required]
})
}

hideShowPass(){
  this.isText= !this.isText;
  this.isText ? this.eyeIcon=" fa-eye":this.eyeIcon="fa-eye-slash"
  this.isText ? this.type="text" :this.type="password"

}



ChangeLang(lang:any){
  const selectedLanguage = lang.target.value;

  localStorage.setItem('lang',selectedLanguage);

  this.translateService.use(selectedLanguage);

}


onLogin(){
    if(this.loginForm.valid){
      //alert("form  is  valid");
      //send the obj to database
      console.log(this.loginForm.value)
      this.auth.login(this.loginForm.value).subscribe({
        next:(res)=>{
         // alert(res.message);
         console.log('Response:', res);
          // Use Angular's Router.navigate method
          this.loginForm.reset();
         
          this.auth.storeToken(res.accessToken); 
          this.auth.storeRefreshToken(res.refreshToken);
          console.log(res.refreshToken);
          const tokenPlaload =this.auth.decodedToken();
         // this.userStore.setFullNameForStore(tokenPlaload.unique_name);
          //this.userStore.setRoleForStore(tokenPlaload.role);
          if (tokenPlaload && tokenPlaload.unique_name) {
            this.userStore.setFullNameForStore(tokenPlaload.unique_name);
            this.userStore.setRoleForStore(tokenPlaload.role);
          }
          this.router.navigate(['dashboard']);
          console.log(res.usertoken)
         // this.toast.success({detail:"SUCCESS",summary:res.message,duration:5000});
          Swal.fire('Thank you...' , res.message, 'success')
        },
        error:(err)=>{
           //alert(err?.error.message)
          Swal.fire('Error',err?.error.message, 'warning')
        }
      })

      

    }else{
      //throw the error using toaster and with reaquired fields
      //alert("form  is not valid");
      
      // console.log("form  is not valid")
      // this.validateAllFormFileds(this.loginForm);


      ValidateForm.validateAllFormFileds(this.loginForm);

      // alert("You form is invalid");

      Swal.fire('You form is invalid', 'Create TEID and password', 'error')
    }

  }


  // private validateAllFormFileds(formGroup:FormGroup){
  //   Object.keys(formGroup.controls).forEach(field=>{
  //     const controls =formGroup.get(field);
  //     if(controls instanceof FormControl){
  //       controls.markAsDirty({onlySelf:true});
  //     }else if (controls instanceof FormGroup){
  //       this.validateAllFormFileds(controls)
  //     }

  //   })
  // }


  checkValidEmail(event: string) {
    const value = event;
    const generalPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const specificPattern = /@gmail\.com$/;
    this.isValidEmail = generalPattern.test(value) && specificPattern.test(value);
    return this.isValidEmail;
}


checkTEValid(event: string) {
  const value = event;
  // Adjust the pattern to match your TEID format
  const pattern = /^te\d+$/i;
  this.isValidTEID = pattern.test(value);
  return this.isValidTEID;
}


confirmToSend() {
  if (this.teID || this.resetPasswordEmail) {
    console.log("TEID:", this.teID);
    console.log("Email:", this.resetPasswordEmail );

    this.resetService.sendRestPasswordLink(this.ResetPasswordForm.value).subscribe({
      next: (res) => {
        Swal.fire(res.message, 'success');
        console.log(res.newPassword)
        this.resetPasswordEmail = "";
        this.teID = "";
        const btnRef = document.getElementById("closeBtn");
        btnRef?.click();
      },
      error: (err) => {
        Swal.fire(err?.error.message, 'error');
      }
    });
  } else {
    console.log("TEID and Email are not provided");
    // Handle the case where either TEID or Email is not provided
    // Display an error message, if needed
  }
}




}
