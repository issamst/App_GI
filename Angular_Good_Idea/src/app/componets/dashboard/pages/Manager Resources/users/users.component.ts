import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RoleService } from '../../../../../services/role.service';
import { ApiService } from '../../../../../services/api.service';
import { AuthService } from '../../../../../services/auth.service';
import { UserStoreService } from '../../../../../services/user-store.service';
import { TitleServiceService } from '../../../../../services/title-service.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  sortOrder: string = 'asc';
  userId: number = 0;
  selectedUser: any = null;
  showUpdateUserModal: boolean = false;
  editingUserId: number | null = null;

  currentPageRole: number = 1;
  currentPageUser: number = 1;
  rolesPerPage: number = 5; 
  UserPerPage: number = 9; 
  public user: any = [];
  users:any=[];
  roles: any[] = [];
  titles: any[] = []; 

  currentPage: number = 1;
  titlesPerPage: number = 5; // Number of titles to display per page
  public fullName: string = '';
  public searchtext: string = '';
  public role!: string;
  titleForm!: FormGroup;
  RoleForm!: FormGroup;
  userForm!: FormGroup;
  selectedTitleId: number | null = null;
  selectedPlantId: number | null = null;
  selectedDepartementId: number | null = null;
  selectedRoleId: number | null = null;
  searchTitle: string = '';
  selectedUserId: any = null;
  isFormDisabled: boolean = false;
  totalSignupsYesterday: number = 0;
  totalSignupsToday: number = 0;
  totalStatus: number = 0;
  successMessage!: string;
  isAscendingOrder: boolean = true; // Initially set to true for ascending order
  sortedColumn: string = '';
  sortingColumn: string = '';
  sortingOrder: string = 'asc';
  sortBy: string = '';
  sortDirection: number = 1;
  isUserOverlayOpen: boolean = false;
  showColumns = {
    teid: true,
    fullName: true,
    phone: true,
    role: true,
    job: true,
    email: true,
    plant: true,
    department: true,
    status: true,
    timeOpen: true,
    registerTime: true,
    timeChangePassword: true,
    requestPassword: true
};  
public plantList: any = [];
public departementList: any = [];
  constructor(
    private dialog: MatDialog,
    private roleService: RoleService,
    private fb: FormBuilder,
    private api: ApiService,
    private auth: AuthService,
    private userStore: UserStoreService,
    private titleService: TitleServiceService,
    private router: Router ,
    
  ) {
   
  }
  toggleDropdown() {
    this.isUserOverlayOpen = !this.isUserOverlayOpen;
  }

ngOnInit() {
 


    

    this.titleForm = this.fb.group({
      Name_Title: ['', Validators.required],
    });
    this.RoleForm= this.fb.group({
      Name_Role: ['', Validators.required],
    });
    this.api.getUsers().subscribe((res) => {
      this.users = res;
    });
    this.calculateSignupsYesterday();
    this.titleService.getAllTitle().subscribe((res) => {
      this.titles = res;
    });
    
    
    
    this.roleService.getAllRoles().subscribe((res)=>{
      this.roles=res;
    });
  
    this.userStore.getFullNameFromStore().subscribe((val) => {
      const fullNameFromToken = this.auth.getfullNameFromToken();
      this.fullName = val || fullNameFromToken;
    });

    this.userStore.getRoleFromStore().subscribe((val) => {
      const roleFromToken = this.auth.getRoleFromToken();
      this.role = val || roleFromToken;
    });
    this.totalStatus = this.users.length;
  }



  sortData(columnName: string) {
    console.log("columnName   : => ",columnName);
    if (this.sortBy === columnName) {
      // Reverse sort direction if same column is clicked again
      this.sortDirection = this.sortDirection === 1 ? -1 : 1;
    } else {
      // Set new column to sort and reset sort direction
      this.sortBy = columnName;
      this.sortDirection = 1;
    }

    // Sort the data based on the selected column and direction
    this.users.sort((a:any, b:any) => {
      if (a[columnName] < b[columnName]) return -1 * this.sortDirection;
      if (a[columnName] > b[columnName]) return 1 * this.sortDirection;
      return 0;
    });
  }
  
  
  getForgotPassworPending(): number {
    const pendingUsers = this.users.filter((user: any) => user.request === 'pending');
    return pendingUsers.length ;
  }

  // Function to calculate the percentage of users with 'done' status
  getForgotPasswordone(): number {
    const doneUsers = this.users.filter((user: any) => user.request === 'done');
    return doneUsers.length ;
  }

  // Function to get the total number of users
  totalForgotPassword(): number {
    return this.users.length;
  }
  TotalStatus():number{
    return this.users.length;
  }
  getStatusPending(): number {
    // Logic to calculate the percentage of pending status
    // For example:
    const pendingUsers = this.users.filter((user: any) => user.status === 'pending');
    return pendingUsers.length;
  }
  getStatusDone(): number {
    // Logic to calculate the percentage of done status
    // For example:
    const doneUsers = this.users.filter((user: any) => user.status === 'done');
    return doneUsers.length ;
  }
  getPercentageChangeToday() {
    const today = new Date();
    let signupsToday = 0; 
    
    this.users.forEach((user: User) => {
        if (user.registerTime) {
            const registrationDate = new Date(user.registerTime);
            if (
                registrationDate.getDate() === today.getDate() &&
                registrationDate.getMonth() === today.getMonth() &&
                registrationDate.getFullYear() === today.getFullYear()
            ) {
                
                signupsToday++;
            }
        }
    });
    
    return signupsToday;
}
getArrowIcon(percentageChange: number): string {
  // Check if the percentage change is positive or negative
  if (percentageChange > 0) {
      return "fas fa-arrow-up text-success"; // Green color for arrow up icon
  } else {
      return "fas fa-arrow-down text-danger"; // Red color for arrow down icon
  }
}


getPercentageChangeYesterday() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1); // Set the date to yesterday
  
  let signupsYesterday = 0; // Initialize the count for signups yesterday
  
  this.users.forEach((user: User) => {
      if (user.registerTime) {
          const registrationDate = new Date(user.registerTime);
          if (
              registrationDate.getDate() === yesterday.getDate() &&
              registrationDate.getMonth() === yesterday.getMonth() &&
              registrationDate.getFullYear() === yesterday.getFullYear()
          ) {
              // Increment the count if the registration date matches yesterday's date
              signupsYesterday++;
          }
      }
  });
  
  return signupsYesterday;
}

  toggleFormControls() {
    this.isFormDisabled = !this.isFormDisabled;
  }
  setSelectedUserId(userId: string | number) {
    this.selectedUserId = userId;
  }
  get totalTitles(): number {
    return this.titles.length;
  }

  get totalPages(): number {
    return Math.ceil(this.totalTitles / this.titlesPerPage);
  }

  get pages(): number[] {
    const pagesArray = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }

  changePage(page: number): void {
    this.currentPage = page;
  }


request(id: number) {
    console.log("id :",id)
    this.auth.Request(id).subscribe({
      next: (res) => {


        Swal.fire({
          title: 'Request created successfully',
          html: `
              <input type="text" id="swal-input" class="swal2-input" value="${res.message}" style="font-weight: bold;  text-align:center ;font-size: 25px" disabled>
          `,
          showCancelButton: true,
          confirmButtonText: 'Submit',
          cancelButtonText: 'Cancel',
      }).then((res)=>{
        window.location.reload();
      });
      
      
        
       
        
      },
      error: (error) => {
        // Handle error response
        Swal.fire('Error', error.error.Message || 'An error occurred', 'error');
      },
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  getDisplayedTitles(): any[] {
    const startIndex = (this.currentPage - 1) * this.titlesPerPage;
    const endIndex = Math.min(startIndex + this.titlesPerPage, this.totalTitles);
    return this.titles.slice(startIndex, endIndex);
  }
  
  changePageRole(page: number): void {
    this.currentPageRole = page;
  }
  changePageUser(page: number): void {
    this.currentPageUser = page;
  }
  nextPageRole(): void {
    if (this.currentPageRole < this.totalPagesRole) {
      this.currentPageRole++;
    }
  }
  nextPageUser(): void {
    if (this.currentPageUser < this.totalPagesUser) {
      this.currentPageUser++;
    }
  }
  prevPageRole(): void {
    if (this.currentPageRole > 1) {
      this.currentPageRole--;
    }
  }
  prevPageUser(): void {
    if (this.currentPageUser > 1) {
      this.currentPageUser--;
    }
  }
  getDisplayedRoles(): any[] {
    const startIndex = (this.currentPageRole - 1) * this.rolesPerPage;
    const endIndex = Math.min(startIndex + this.rolesPerPage, this.roles.length);
    return this.roles.slice(startIndex, endIndex);
  }
  getDisplayedUsers(): any[] {
    const startIndex = (this.currentPageUser - 1) * this.UserPerPage;
    const endIndex = Math.min(startIndex + this.UserPerPage, this.users.length);
    return this.users.slice(startIndex, endIndex);
  }
  
  get totalRoles(): number {
    return this.roles.length;
  }
  get totalUses():number{
    return this.users.length;
  }
  
  get totalPagesRole(): number {
    return Math.ceil(this.totalRoles / this.rolesPerPage);
  }
  get totalPagesUser(): number {
    return Math.ceil(this.totalUses / this.UserPerPage);
   
  }
  get pagesRole(): number[] {
    const pagesArray = [];
    for (let i = 1; i <= this.totalPagesRole; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }
  get pagesUser(): number[] {
    const pagesArray = [];
    for (let i = 1; i <= this.totalPagesUser; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }
 
  

  
  
 









  
  calculateSignupsYesterday() {
    console.log("Users array:", this.users);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
  
    const signupsYesterday = this.users.filter((user: User) => {
      console.log("User:", user);
      if (user.registerTime) {
        const registrationDate = new Date(user.registerTime);
        console.log("Registration Date:", registrationDate);
        return registrationDate.getDate() === yesterday.getDate() &&
               registrationDate.getMonth() === yesterday.getMonth() &&
               registrationDate.getFullYear() === yesterday.getFullYear();
      }
      return false;
    });
  
    this.totalSignupsYesterday = signupsYesterday.length;
  }
  
  

 
onSaveTitle() {
  if (this.titleForm.valid) {
      this.titleService.saveTitle(this.titleForm.value).subscribe({
          next: (res) => {
              Swal.fire('Success', res.message, 'success');
              this.titleForm.reset();
              this.updateTitles(); // Call method to update titles array
              // Call selectTitle with the ID of the newly added title
              
          },
          error: (err) => {
              console.error('Error:', err);
              Swal.fire(
                  'Error',
                  'An error occurred while saving the title',
                  'error'
              );
          },
      });
  } else {
      // Show validation error if form is invalid
      Swal.fire('Error', 'Please provide a valid title', 'warning');
  }
}


updateTitles() {
  // Refresh titles array by fetching all titles again
  this.titleService.getAllTitle().subscribe((res) => {
    this.titles = res;
  });
}
updateRoles() {
  // Refresh titles array by fetching all titles again
  this.roleService.getAllRoles().subscribe((res) => {
    this.roles = res;
  });
}
deleteTitle(id: number) {
  
    // this.titleService.deleteTitle(id).subscribe({
    //   next: (res) => {
    //     Swal.fire('Success', 'Title deleted successfully', 'success');
    //     this.updateTitles(); // Refresh titles array
    //   },
    //   error: (err) => {
    //     console.error('Error:', err);
    //     Swal.fire('Error', 'An error occurred while deleting the title', 'error');
    //   },
    // });
  
}



selectTitle(titleId: number) {
  this.selectedTitleId = null;
  const selectedTitle = this.titles.find(title => title.id === titleId);
  if (selectedTitle) {
      selectedTitle.isEditing = true;
  }
}

selectDepartement(departementID: number) {
  this.selectedDepartementId = null;
  const selectedDepartement = this.users.find((departement: any)=>departement.id=== departementID);
  if (selectedDepartement) {
    selectedDepartement.isEditing = true;
  }
}

onUpdateTitle(title: any) {
  // Check if the title name is not empty
  if (title.name_Title.trim() !== '') {
      // Call the updateTitle method from your service passing the updated title
      this.titleService.updateTitle(title.id, { Name_Title: title.name_Title }).subscribe({
          next: (res) => {
              // Handle success response
              Swal.fire('Success', res.message, 'success');
              this.updateTitles(); // Update the titles array
          },
          error: (err) => {
              // Handle error response
              console.error('Error:', err);
              Swal.fire('Error', 'An error occurred while updating the title', 'error');
          },
      });
  } else {
      // If the title name is empty, show a warning
      Swal.fire('Error', 'Title name cannot be empty', 'warning');
  }

  // Set isEditing to false after updating or blurring the input field
  title.isEditing = false;
}



//   Role


selectRole(id: number) {
if (this.selectedRoleId === id) {
    this.selectedRoleId = null;
    this.RoleForm.reset(); 
} else {
    this.selectedRoleId = id; 
    this.roleService.getRoleById(id).subscribe((role) => {
        this.RoleForm.patchValue({
            Name_Role: role.name_Role
        });
    });
  }
}



onSaveRole() {
if (this.RoleForm.valid) {
  this.roleService.addRole(this.RoleForm.value).subscribe({
    next: (res) => {
      Swal.fire('Success', res.message, 'success');
      
      this.RoleForm.reset();
      
      
    this.updateRoles();
      this.selectRole(res.id); 
    },
    error: (err) => {
      console.error('Error:', err);
      Swal.fire('Error', 'An error occurred while saving the role', 'error');
    }
  });
} else {
  Swal.fire('Error', 'Please provide valid role information', 'warning');
}
}


// Inside MainDashboardComponent

onUpdateRole() {
if (this.RoleForm.valid && this.selectedRoleId !== null) {
  this.roleService.updateRole(this.selectedRoleId, this.RoleForm.value).subscribe({
    next: (res) => {
      Swal.fire('Success', res.message, 'success');
      this.RoleForm.reset();
      this.updateRoles(); // Call method to update roles array
    },
    error: (err) => {
      console.error('Error:', err);
      Swal.fire('Error', 'An error occurred while updating the role', 'error');
    },
  });
} else {
  Swal.fire('Error', 'Please select a role and provide valid information', 'warning');
}
}

deleteRole(id: number) {
// if (id !== null) {
//   this.roleService.deleteRole(id).subscribe({
//     next: (res) => {
//       Swal.fire('Success', 'Role deleted successfully', 'success');
//       this.updateRoles(); // Refresh roles array
//     },
//     error: (err) => {
//       console.error('Error:', err);
//       Swal.fire('Error', 'An error occurred while deleting the role', 'error');
//     },
//   });
// } else {
//   Swal.fire('Error', 'Please select a role to delete', 'warning');
// }
}

}
interface User {
 
  registerTime: string;
}

