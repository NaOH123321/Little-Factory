import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as actions from '../actions/auth.action';
import * as routerActions from '../actions/router.action';
import { AuthService } from '../services/auth.service';
import { switchMap, map, catchError } from 'rxjs/operators';
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
                catchError(err => of(new actions.AuthLoginFailAction({
                    status: 501,
                    message: err.message,
                    exception: err.stack,
                    path: '/login',
                    timestamp: new Date()
                })))
            )
        )
    );

    @Effect()
    loginAndNavigate$: Observable<Action> = this.actions$.pipe(
        ofType<actions.AuthActions>(actions.AuthActionTypes.AuthLoginSuccessAction),
        map(_ => new routerActions.GoAction({ path: ['/projects'] }))
    );

    @Effect()
    register$: Observable<Action> = this.actions$.pipe(
        ofType<actions.AuthActions>(actions.AuthActionTypes.AuthRegisterAction),
        map(action => action.payload),
        switchMap((user: User) =>
            this.service$.register(user).pipe(
                map(auth => new actions.AuthRegisterSuccessAction(auth)),
                catchError(err => of(new actions.AuthRegisterFailAction({
                    status: 501,
                    message: err.message,
                    exception: err.stack,
                    path: '/register',
                    timestamp: new Date()
                }
                )))
            )
        )
    );

    @Effect()
    registerAndNavigate$: Observable<Action> = this.actions$.pipe(
        ofType<actions.AuthActions>(actions.AuthActionTypes.AuthRegisterSuccessAction),
        map(_ => new routerActions.GoAction({ path: ['/projects'] }))
    );

    @Effect()
    logout$: Observable<Action> = this.actions$.pipe(
        ofType<actions.AuthActions>(actions.AuthActionTypes.AuthlogoutAction),
        map(_ => new routerActions.GoAction({ path: ['/'] }))
    );

    constructor(private actions$: Actions, private service$: AuthService) { }
}