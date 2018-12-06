import { Action } from '@ngrx/store';
import { Auth, User } from './../domain';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export enum AuthActionTypes {
    AuthLoginAction = '[Auth] Auth Login',
    AuthLoginSuccessAction = '[Auth] Auth Login Success',
    AuthLoginFailAction = '[Auth] Auth Login Fail',
    AuthRegisterAction = '[Auth] Auth Register',
    AuthRegisterSuccessAction = '[Auth] Auth Register Success',
    AuthRegisterFailAction = '[Auth] Auth Register Fail',
    AuthlogoutAction = '[Auth] Auth Logout',
};

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful 
 * type checking in reducer functions.
 */
export class AuthLoginAction implements Action {
    readonly type = AuthActionTypes.AuthLoginAction;

    constructor(public payload: { email: string, password: string }) { }
}

export class AuthLoginSuccessAction implements Action {
    readonly type = AuthActionTypes.AuthLoginSuccessAction;

    constructor(public payload: Auth) { }
}

export class AuthLoginFailAction implements Action {
    readonly type = AuthActionTypes.AuthLoginFailAction;

    constructor(public payload: string) { }
}

export class AuthRegisterAction implements Action {
    readonly type = AuthActionTypes.AuthRegisterAction;

    constructor(public payload: User) { }
}

export class AuthRegisterSuccessAction implements Action {
    readonly type = AuthActionTypes.AuthRegisterSuccessAction;

    constructor(public payload: Auth) { }
}

export class AuthRegisterFailAction implements Action {
    readonly type = AuthActionTypes.AuthRegisterFailAction;

    constructor(public payload: string) { }
}
export class AuthlogoutAction implements Action {
    readonly type = AuthActionTypes.AuthlogoutAction;

    constructor(public payload: null) { }
}
/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type AuthActions
    = AuthLoginAction
    | AuthLoginSuccessAction
    | AuthLoginFailAction
    | AuthRegisterAction
    | AuthRegisterSuccessAction
    | AuthRegisterFailAction
    | AuthlogoutAction;
