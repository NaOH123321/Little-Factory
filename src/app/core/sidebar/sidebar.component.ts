import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { getDate } from "date-fns";
import { Project } from 'src/app/domain';
import { Observable } from 'rxjs';
import * as fromRoot from '../../reducers';
import * as projectActions from './../../actions/project.action';
import { Store, select } from '@ngrx/store';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Output()
  navClick = new EventEmitter<void>();

  projects$: Observable<Project[]>;
  today = "day";

  constructor(private store$: Store<fromRoot.State>) { }

  ngOnInit() {
    this.today = `day${getDate(new Date())}`;
    this.projects$ = this.store$.pipe(select(fromRoot.getProjectAll));
  }
  onNavClick() {
    this.navClick.emit();
  }

  onProjectClick(project: Project) {
    this.navClick.emit();
    this.store$.dispatch(new projectActions.ProjectSelectAction(project));
  }
}
