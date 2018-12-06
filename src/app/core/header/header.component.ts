import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import { Observable } from 'rxjs';
import { Auth } from '../../domain';
import * as authActions from '../../actions/auth.action';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  auth$: Observable<Auth>;
  @Output()
  toggle = new EventEmitter<void>();
  @Output()
  toggleDarkTheme = new EventEmitter<boolean>();

  constructor(private store$: Store<fromRoot.State>) { }

  ngOnInit() {
    this.auth$ = this.store$.pipe(select(fromRoot.getAuth));
  }

  openSidebar() {
    this.toggle.emit();
  }

  changeTheme(checked: boolean) {
    this.toggleDarkTheme.emit(checked);
  }

  logout() {
    this.store$.dispatch(new authActions.AuthlogoutAction(null));
  }
}
