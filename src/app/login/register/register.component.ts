import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { debounceTime, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { extractInfo, isValidAddr, getAddrByCode } from '../../utils/identity.util';
import { isValidDate } from '../../utils/date.util';
import { debug } from '../../utils/debug.util';
import * as fromRoot from '../../reducers';
import * as authActions from './../../actions/auth.action';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  form: FormGroup;

  items: string[] = [];
  private sub: Subscription;
  constructor(private fb: FormBuilder, private store$: Store<fromRoot.State>) { }

  ngOnInit() {
    for (let i = 1; i <= 16; i++) {
      this.items.push(`avatars:svg-${i}`);
    }

    const img = `avatars:svg-${Math.ceil(Math.random() * 16).toFixed(0)}`;
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      password: ['', Validators.required],
      repeat: ['', Validators.required],
      avatar: [img],
      identity: [''],
      birthday: [''],
      address: ['']
    });
    const val$ = this.form.get("identity").valueChanges.pipe(
      debounceTime(300),
      filter(_ => this.form.get("identity").valid),
      debug("identity:")
    );
    this.sub = val$.subscribe(id => {
      const info = extractInfo(id.identityNo);
      if (isValidAddr(info.addrCode)) {
        const addr = getAddrByCode(info.addrCode);
        this.form.get("address").patchValue(addr);
        // this.form.updateValueAndValidity({ onlySelf: true, emitEvent: true });
      }
      if (isValidDate(info.dateOfBirth))
        this.form.get("birthday").patchValue(info.dateOfBirth);
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  onSubmit({ value, valid }, ev: Event) {
    ev.preventDefault();
    this.store$.dispatch(new authActions.AuthRegisterAction({
      email: value.email,
      name: value.name,
      password: value.password,
      avatar: value.avatar,
      identity: value.identity,
      birthday: value.birthday,
      address: value.address
    }));
  }
}
