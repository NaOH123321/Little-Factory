import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { TaskModule } from './task/task.module';
import { MyCalendarModule } from './my-calendar';
import { ProjectModule } from './project/project.module';

const routes: Routes = [
  // { path: "", redirectTo: "/login", pathMatch: "full" },
  // { path: "projects", redirectTo: "/projects", pathMatch: "full" }, 
  // { path: "tasklists", redirectTo: "/tasklists", pathMatch: "full" },
  // { path: "mycal", redirectTo: "/mycal", pathMatch: "full" },
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full"
  },
  {
    path: "projects",
    loadChildren: "./project/project.module#ProjectModule",
    // loadChildren: () => ProjectModule,
    pathMatch: "full",
    canActivate: [AuthGuardService]
  },
  {
    path: "tasklists/:id",
    loadChildren: "./task/task.module#TaskModule",
    // loadChildren: () => TaskModule,
    canActivate: [AuthGuardService]
  },
  {
    path: "mycal/:view",
    loadChildren: "./my-calendar/index#MyCalendarModule",
    // loadChildren: () => MyCalendarModule,
    canActivate: [AuthGuardService]
  },
  {
    path: '**', redirectTo: '/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
