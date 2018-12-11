import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { TaskService } from 'src/app/services/task.service';
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import { startOfDay, endOfDay } from 'date-fns';
import { debug } from 'src/app/utils/debug.util';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

const getColor = (priority: number) => {
  switch (priority) {
    case 1:
      return colors.red;
    case 2:
      return colors.blue;
    default:
      return colors.yellow;
  }
}

@Component({
  selector: 'app-calendar-home',
  templateUrl: './calendar-home.component.html',
  styles: [`
  .toolbar{
    display: flex;
    flex-drection: row;
  }
  mat-card {
    width: 100%;
  }
  `]
})
export class CalendarHomeComponent implements OnInit {

  viewDate: Date;
  view$: Observable<string>;
  event$: Observable<CalendarEvent[]>;

  constructor(private route: ActivatedRoute, private store$: Store<fromRoot.State>, private service$: TaskService) { }

  ngOnInit() {
    this.viewDate = new Date();
    this.view$ = this.route.paramMap.pipe(map(p => p.get("view")));
    this.event$ = this.store$.pipe(
      select(fromRoot.getAuthUser),
      switchMap(user => this.service$.getAllTasks(user.id)),
      map(tasks => tasks.map(task => ({
        start: startOfDay(task.createDate),
        end: endOfDay(task.dueDate),
        title: task.desc,
        color: getColor(task.priority)
      })))
    );
  }

  handleEvent(event: CalendarEvent): void {
    console.log('events handled');
  }
}
