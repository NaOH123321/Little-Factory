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
        ofType<actions.AuthLoginAction>(actions.AuthActionTypes.AUTH_LOGIN),
        map(action => action.payload),
        switchMap(({ email, password }) =>
            this.service$.login(email, password).pipe(
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
        ofType<actions.AuthLoginSuccessAction>(actions.AuthActionTypes.AUTH_LOGIN_SUCCESS),
        map(_ => new routerActions.GoAction({ path: ['/projects'] }))
    );

    @Effect()
    register$: Observable<Action> = this.actions$.pipe(
        ofType<actions.AuthRegisterAction>(actions.AuthActionTypes.AUTH_REGISTER),
        map(action => action.payload),
        switchMap(user =>
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
        ofType<actions.AuthRegisterSuccessAction>(actions.AuthActionTypes.AUTH_REGISTER_SUCCESS),
        map(_ => new routerActions.GoAction({ path: ['/projects'] }))
    );

    @Effect()
    logout$: Observable<Action> = this.actions$.pipe(
        ofType<actions.AuthlogoutAction>(actions.AuthActionTypes.AUTH_LOGOUT),
        map(_ => new routerActions.GoAction({ path: ['/'] }))
    );

    constructor(private actions$: Actions, private service$: AuthService) { }
}