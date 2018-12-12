import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Quote } from './../../domain';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import * as quoterActions from './../../actions/quote.action';
import * as authActions from './../../actions/auth.action';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  quote$: Observable<Quote>;
  constructor(private fb: FormBuilder, private store$: Store<fromRoot.State>) {
    this.quote$ = store$.pipe(select(fromRoot.getQuote));
    store$.dispatch(new quoterActions.QuoteAction(null));
  }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['lisi@163.com', [Validators.required, Validators.email]],
      password: ['Ls123456', Validators.required]
    });
  }

  onSubmit({ value, valid }, ev: Event) {
    ev.preventDefault();

    this.store$.dispatch(new authActions.AuthLoginAction(value));
  }
}
