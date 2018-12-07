import { Action } from '@ngrx/store';
import { Auth, User, Err } from './../domain';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export enum AuthActionTypes {
    AUTH_LOGIN = '[Auth] Auth Login',
    AUTH_LOGIN_SUCCESS = '[Auth] Auth Login Success',
    AUTH_LOGIN_FAIL = '[Auth] Auth Login Fail',
    AUTH_REGISTER = '[Auth] Auth Register',
    AUTH_REGISTER_SUCCESS = '[Auth] Auth Register Success',
    AUTH_REGISTER_FAIL = '[Auth] Auth Register Fail',
    AUTH_LOGOUT = '[Auth] Auth Logout',
};

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful 
 * type checking in reducer functions.
 */
export class AuthLoginAction implements Action {
    readonly type = AuthActionTypes.AUTH_LOGIN;

    constructor(public payload: { email: string, password: string }) { }
}

export class AuthLoginSuccessAction implements Action {
    readonly type = AuthActionTypes.AUTH_LOGIN_SUCCESS;

    constructor(public payload: Auth) { }
}

export class AuthLoginFailAction implements Action {
    readonly type = AuthActionTypes.AUTH_LOGIN_FAIL;

    constructor(public payload: Err) { }
}

export class AuthRegisterAction implements Action {
    readonly type = AuthActionTypes.AUTH_REGISTER;

    constructor(public payload: User) { }
}

export class AuthRegisterSuccessAction implements Action {
    readonly type = AuthActionTypes.AUTH_REGISTER_SUCCESS;

    constructor(public payload: Auth) { }
}

export class AuthRegisterFailAction implements Action {
    readonly type = AuthActionTypes.AUTH_REGISTER_FAIL;

    constructor(public payload: Err) { }
}
export class AuthlogoutAction implements Action {
    readonly type = AuthActionTypes.AUTH_LOGOUT;

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
