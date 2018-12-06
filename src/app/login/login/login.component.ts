import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Quote } from './../../domain';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../reducers'
import * as actions from './../../actions/quote.action';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  quote$: Observable<Quote>;
  constructor(private fb: FormBuilder, private $store: Store<fromRoot.State>) {
    this.quote$ = $store.pipe(select(fromRoot.getQuote));
    // this.quoteService$.getQuote().subscribe(q =>
    //   $store.dispatch(new actions.QuoteSuccessAction(q))
    // );
    $store.dispatch(new actions.QuoteAction(null));
  }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['12345678@qq.com', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit({ value, valid }, ev: Event) {
    ev.preventDefault();
    console.log(JSON.stringify(value));
    console.log(valid);
  }
}
