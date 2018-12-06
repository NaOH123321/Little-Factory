import { Auth, Err } from "../domain";
import * as authAction from '../actions/auth.action';

export const initialState: Auth = {};

export function reducer(state = initialState, action: authAction.AuthActions): Auth {
    switch (action.type) {
        case authAction.AuthActionTypes.AuthLoginSuccessAction:
        case authAction.AuthActionTypes.AuthRegisterSuccessAction:
            return { ...action.payload };
        case authAction.AuthActionTypes.AuthLoginFailAction:
        case authAction.AuthActionTypes.AuthRegisterFailAction:
            return { err: action.payload };
        default: {
            return state;
        }
    }
}