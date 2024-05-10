import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreaComponent } from './area.component';
import { MoldingComponent } from './molding/molding.component';

const routes: Routes = [
  {path:'molding',component:MoldingComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AreaRoutingModule {




  
 }
