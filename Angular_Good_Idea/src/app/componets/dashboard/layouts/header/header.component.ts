import { style } from '@angular/animations';
import { Component, OnInit, Input, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // Import the required functions
import { languages,notification ,userItems} from './header-dummy-data';
import { ApiService } from '../../../../services/api.service';
import { AuthService } from '../../../../services/auth.service';
import { UserStoreService } from '../../../../services/user-store.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'] // Use 'styleUrls' instead of 'styleUrl'
})
export class HeaderComponent implements OnInit {

  @Input() collapsed = false;
  @Input() screenWidth = 0;
  canShowSearchAsOverlay = false;

  selectedLanguage:any;
  languages=languages;
  notifications=notification;
  userItem=userItems;
  @Input() fullName: string = '';
  isUserOverlayOpen: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object ,
  private api: ApiService,
  private auth: AuthService,
  private userStore: UserStoreService,
  private router: Router
) {} // Inject the PLATFORM_ID
toggleDropdown() {
  this.isUserOverlayOpen = !this.isUserOverlayOpen;
}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) { // Check if running in a browser environment
      this.checkCanShowSearshAsOverlay(window.innerWidth);
    }
    this.selectedLanguage=this.languages[0];
    this.userStore.getFullNameFromStore().subscribe((val) => {
      const fullNameFromToken = this.auth.getfullNameFromToken();
      this.fullName = val || fullNameFromToken;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (isPlatformBrowser(this.platformId)) { // Check if running in a browser environment
      this.checkCanShowSearshAsOverlay(window.innerWidth);
    }
  }

  getHeadClass(): string {
    let styleClass = '';
    if (this.collapsed && this.screenWidth > 768) {
      styleClass = 'head-trimmed';
    } else {
      styleClass = 'head-md-screen';
    }
    return styleClass;
  }

  checkCanShowSearshAsOverlay(innerWidth: number): void {
    if (innerWidth < 845) {
      this.canShowSearchAsOverlay = true;
    } else {
      this.canShowSearchAsOverlay = false;
    }
  }

  getAvatarStyle() {
    if (!this.fullName) return {}; // No need for background if no name
    const initials = this.getInitials();
    return {
      'background-color': this.getColor(initials),
    };
  }
  getAvatarImage(): string {
    if (!this.fullName) return ''; // No need for image if no name
    const initials = this.getInitials();
    return `https://ui-avatars.com/api/?name=${initials}&size=32&rounded=true`;
}

  getInitials(): string {
    if (!this.fullName) return '';
    const nameParts = this.fullName.trim().split(' ');
    return nameParts.map(part => part.charAt(0).toUpperCase()).join('');
  }

  getColor(str: string): string {
    // Generate a color based on the initials
    // This function is just a simple example; you can use any logic you prefer
    const colors = ['#FF5733', '#3498DB', '#27AE60', '#F1C40F', '#8E44AD', '#E74C3C'];
    const charCodeSum = str.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charCodeSum % colors.length];
  }

  // logout() {
  //   //Swal.fire('Thank you...', 'You submitted succesfully!', 'success')

  //   Swal.fire({
  //     title: 'Are you sure want to remove?',
  //     text: 'You will not be able to recover this file!',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, delete it!',
  //     cancelButtonText: 'No, keep it',
  //   }).then((result) => {
  //     if (result.value) {
  //       Swal.fire('Out!', 'Your imaginary file has been deleted.', 'success');
  //       this.auth.signOut();
  //     } else if (result.dismiss === Swal.DismissReason.cancel) {
  //       this.router.navigate(['dashboard']);
  //       Swal.fire('Cancelled', 'Your imaginary file is safe :)', 'error');
  //     }
  //   });
  // }
  logout() {
    //Swal.fire('Thank you...', 'You submitted succesfully!', 'success')

    Swal.fire({
      title: 'Good By ',
      text: 'Thans You For You',
      icon: 'success',
      
    });
    this.auth.signOut();
  }

}
