import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';




import { AreaModule } from './area/area.module';




import { ManagerResourcesModule } from './Manager Resources/manager-resources.module';
import { ProposeIdeaComponent } from './Propose Idea/propose-idea/propose-idea.component';


const routes: Routes = [
  { path: '', component: ProposeIdeaComponent },
  

  {
    path: 'area',
    loadChildren: () => AreaModule,
  },
 
  { path: 'proposeidea', component: ProposeIdeaComponent },
  
  {
    path: 'managerresources',
    loadChildren: () => ManagerResourcesModule,
  },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
