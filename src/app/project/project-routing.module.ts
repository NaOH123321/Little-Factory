import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectListComponent } from './project-list/project-list.component';
import { AuthGuardService } from '../services/auth-guard.service';

const routes: Routes = [
    // { path: "projects", component: ProjectListComponent, canActivate: [AuthGuardService] },
    { path: "", component: ProjectListComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectRoutingModule { }
