import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../services/auth-guard.service';
import { TaskModule } from '../task/task.module';
import { MyCalendarModule } from '../my-calendar';

const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "projects", redirectTo: "/projects", pathMatch: "full" },
  { path: "tasklists", redirectTo: "/tasklists", pathMatch: "full" },
  // { path: "tasklists/:id", loadChildren: () => TaskModule, canActivate: [AuthGuardService] },
  // { path: "mycal/:view", loadChildren: () => MyCalendarModule, canActivate: [AuthGuardService] }
  { path: "mycal", redirectTo: "/mycal", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
