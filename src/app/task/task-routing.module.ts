import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskHomeComponent } from './task-home/task-home.component';
import { AuthGuardService } from '../services/auth-guard.service';

const routes: Routes = [
    // { path: "tasklists/:id", component: TaskHomeComponent, canActivate: [AuthGuardService] },
    { path: "", component: TaskHomeComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TaskRoutingModule { }
