import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import ValidateForm from '../../helpers/validateform';
import { TitleServiceService } from '../../services/title-service.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  signupForm!: FormGroup;
  lang: string = '';
  isNotOperatorChecked: boolean = false;
  passwordStrengthMessage: string = '';
  public titles: any = [];



  constructor(private http: HttpClient,
    private titleService: TitleServiceService,
    private fb: FormBuilder, 
    private translateService: TranslateService, 
    private auth: AuthService, 
    private router: Router,
    
  ) { }

  toggleNotOperator() {
    this.isNotOperatorChecked = !this.isNotOperatorChecked;
    if (this.isNotOperatorChecked) {
      // Clear the email field when "Not Operator" checkbox is checked
      this.signupForm.get('Email')?.reset('');
    }
  }

  ngOnInit(): void {
    this.titleService.getAllTitle().subscribe((res) => {
      this.titles = res;
  });

  

    this.signupForm = this.fb.group({
      TEID: ['', Validators.required],
      Password: ['', Validators.required],
      FullName: ['', Validators.required],
      TitleID: ['', Validators.required],
      Email: ['', Validators.required],
      Phone: ['', Validators.required],
      PlantID: ['', Validators.required],
      DepartementID: ['', Validators.required]
    });

    this.lang = localStorage.getItem('lang') || 'en';

    // Subscribe to changes in the password field to check its strength
    this.signupForm.get('Password')?.valueChanges.subscribe(value => {
      this.passwordStrengthMessage = this.CheckPasswordStrength(value);
    });
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = " fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  ChangeLang(lang: any) {
    const selectedLanguage = lang.target.value;
    localStorage.setItem('lang', selectedLanguage);
    this.translateService.use(selectedLanguage);
  }

  onSignup() {
    if (this.isNotOperatorChecked) {
      console.log(this.signupForm.value);
      // Send data to the backend excluding the email field
      const { Email, ...formData } = this.signupForm.value;

      this.auth.signUp(formData)
        .subscribe({
          next: (res) => {
            this.signupForm.reset();      // Use Angular's Router.navigate method
            this.router.navigate(['login']);
            Swal.fire('Thank you...', res.message, 'success');
          },
          error: (err) => {
            Swal.fire('Error', err?.error.message, 'warning');
          }
        });
    } else {
      console.log(this.signupForm.value);
      // Send data to the backend including the email field
      this.auth.signUp(this.signupForm.value)
        .subscribe({
          next: (res) => {
            this.signupForm.reset();      // Use Angular's Router.navigate method
            this.router.navigate(['login']);
            Swal.fire('Thank you...', res.message, 'success');
          },
          error: (err) => {
            Swal.fire('Error', err?.error.message, 'warning');
          }
        });
    }
  }

  private CheckPasswordStrength(password: string): string {
    let message = '';
    if (password.length < 8)
      message += " Minimum password length should be 8.\n";

    if (!(new RegExp("[a-z]").test(password) && new RegExp("[A-Z]").test(password) && new RegExp("[0-9]").test(password)))
      message += " Password should be Alphanumeric.\n";

    if (!(/[@!#$%^&*()_+{}\[\]:;|'\\,.\/~`\-=?]/.test(password)))
      message += " Password should contain special characters.\n";

    return message;
  }
  triggerScanner() {
    // Send HTTP GET request to start scanner
    this.http.get<any>('https://localhost:7181/api/User/startScanner').subscribe(
      response => {
       
        console.log(response);
        console.log('Scanned Badge ID:', response.message);
       
      },
      error => {
        console.error('Error starting scanner:', error);
      }
    );
  }
}
