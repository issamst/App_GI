import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainDashboardComponent } from './main-dashboard/main.component';
import { RouterModule } from '@angular/router';
import { PagesRoutingModule } from './pages-routing.module';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';

import {MatTabsModule} from '@angular/material/tabs';

import { MatDialogModule } from '@angular/material/dialog';
import { OverlayModule } from '@angular/cdk/overlay'
import { CdkMenuModule } from '@angular/cdk/menu';





@NgModule({
  declarations: [
    MainDashboardComponent,
   
  

   
    
   

  ],
  imports: [
    FormsModule,
    CommonModule,
    FormsModule, 
    RouterModule, 
    PagesRoutingModule,
    MatTabsModule,MatDialogModule,ReactiveFormsModule ,  OverlayModule ,CdkMenuModule
  
  
  ],
})
export class PagesModule {}
