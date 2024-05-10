import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerResourcesRoutingModule } from './manager-resources-routing.module';
import { UsersComponent } from './users/users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PagesRoutingModule } from '../pages-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { CdkMenuModule } from '@angular/cdk/menu';
import { OverlayModule } from '@angular/cdk/overlay';
import { FilterPipe } from '../../../../filter.pipe';


@NgModule({
  declarations: [
    UsersComponent,FilterPipe
  ],
  imports: [
    CommonModule,
    ManagerResourcesRoutingModule, FormsModule,
    CommonModule,
    FormsModule, 
    RouterModule, 
    PagesRoutingModule,
    MatTabsModule,MatDialogModule,ReactiveFormsModule ,  OverlayModule ,CdkMenuModule
  ]
})
export class ManagerResourcesModule { }
