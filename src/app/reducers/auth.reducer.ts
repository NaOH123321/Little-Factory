import { Auth, Err } from "../domain";
import * as authAction from '../actions/auth.action';

const initialState: Auth = {};

export function reducer(state = initialState, action: authAction.AuthActions): Auth {
    switch (action.type) {
        case authAction.AuthActionTypes.AUTH_LOGIN_SUCCESS:
        case authAction.AuthActionTypes.AUTH_REGISTER_SUCCESS:
            const auth = <Auth>action.payload;
            return {
                token: auth.token,
                userId: auth.userId ? auth.userId : undefined
            };
        case authAction.AuthActionTypes.AUTH_LOGIN_FAIL:
        case authAction.AuthActionTypes.AUTH_REGISTER_FAIL:
            return { err: action.payload };
        case authAction.AuthActionTypes.AUTH_LOGOUT:
            return initialState;
        default: {
            return state;
        }
    }
}