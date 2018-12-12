import { AuthGuardService } from './../services/auth-guard.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalendarHomeComponent } from './calendar-home/calendar-home.component';

const routes: Routes = [
    { path: "", component: CalendarHomeComponent },
    // { path: "mycal/:view", component: CalendarHomeComponent, canActivate: [AuthGuardService] },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MyCalendarRoutingModule { }

