import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { LoginModule } from './login/login.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { SharedModule } from './shared/shared.module';
import { MyCalendarModule } from './my-calendar';

@NgModule({
   declarations: [
      AppComponent
   ],
   imports: [
      BrowserModule,
      CoreModule,
      SharedModule,
      LoginModule,
      //ProjectModule,
      //TaskModule,
      //MyCalendarModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
