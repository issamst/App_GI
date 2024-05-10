import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../../../services/api.service';
import { AuthService } from '../../../../../services/auth.service';
import { UserStoreService } from '../../../../../services/user-store.service';
@Component({
  selector: 'app-molding',
  templateUrl: './molding.component.html',
  styleUrl: './molding.component.css'
})
export class MoldingComponent implements OnInit{
  public users: any = [];
  public fullName: String = '';
  public searchtext: string = '';
  public role!: string;
  constructor(
    private api: ApiService,private auth: AuthService,
    private userStore: UserStoreService,
   
  ) {}

  ngOnInit() {
    this.api.getUsers().subscribe((res) => {
      this.users = res;
    });

    this.userStore.getFullNameFromStore().subscribe((val) => {
      const fullNameFromToken = this.auth.getfullNameFromToken();
      this.fullName = val || fullNameFromToken;
    });

  }
}
