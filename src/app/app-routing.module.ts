import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { TaskModule } from './task';
import { MyCalendarModule } from './my-calendar';

const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "projects", redirectTo: "/projects", pathMatch: "full", canActivate: [AuthGuardService] },
  { path: "tasklists", redirectTo: "/tasklists", pathMatch: "full", canActivate: [AuthGuardService] },
  // { path: "tasklists/:id", loadChildren: () => TaskModule, canActivate: [AuthGuardService] },
  // { path: "mycal/:view", loadChildren: () => MyCalendarModule, canActivate: [AuthGuardService] }
  { path: "mycal", redirectTo:  "/mycal", pathMatch: "full", canActivate: [AuthGuardService] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
