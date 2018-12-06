import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import * as actions from '../actions/auth.action'
import { AuthService } from '../services/auth.service';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { User } from '../domain';

@Injectable()
export class AuthEffects {
    @Effect()
    login$: Observable<Action> = this.actions$.pipe(
        ofType<actions.AuthActions>(actions.AuthActionTypes.AuthLoginAction),
        map(action => action.payload),
        switchMap((login: { email: string, password: string }) =>
            this.service$.login(login.email, login.password).pipe(
                map(auth => new actions.AuthLoginSuccessAction(auth)),
                catchError(err => of(new actions.AuthLoginFailAction(JSON.stringify(err))))
            )
        )
    );

    @Effect()
    register$: Observable<Action> = this.actions$.pipe(
        ofType<actions.AuthActions>(actions.AuthActionTypes.AuthRegisterAction),
        map(action => action.payload),
        switchMap((user: User) =>
            this.service$.register(user).pipe(
                map(auth => new actions.AuthRegisterSuccessAction(auth)),
                catchError(err => of(new actions.AuthRegisterFailAction(JSON.stringify(err))))
            )
        )
    );

    @Effect()
    logout$: Observable<Action> = this.actions$.pipe(
        ofType<actions.AuthActions>(actions.AuthActionTypes.AuthlogoutAction),
        tap(_ => this.router.navigateByUrl('/'))
    );
    constructor(private actions$: Actions, private router: Router, private service$: AuthService) { }
}