import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";
import { User } from './../domain';
import * as userAction from '../actions/user.action';

export interface State extends EntityState<User> {
    // additional entities state properties
    // selectedUserId: string | null;
}

function selectUserId(a: User): string {
    //In this case this would be optional since primary key is id
    return a.id;
}

function sortByEmail(a: User, b: User): number {
    return a.email.localeCompare(b.email);
}

export const adapter: EntityAdapter<User> = createEntityAdapter<User>({
    selectId: selectUserId,
    sortComparer: sortByEmail
});

export const initialState: State = adapter.getInitialState({
    // additional entity state properties
    // selectedUserId: null,
});

export function reducer(state = initialState, action: userAction.UserActions): State {
    switch (action.type) {

        case userAction.UserActionTypes.USER_SEARCH_SUCCESS:
        // case userAction.UserActionTypes.USER_PROJECTS_LOAD_SUCCESS:
        // case userAction.UserActionTypes.USER_PROJECT_LOAD_SUCCESS:
        case userAction.UserActionTypes.USERS_LOAD_SUCCESS:
            return adapter.addAll(action.payload, state);
        case userAction.UserActionTypes.USER_PROJECT_DELETE_SUCCESS:
        case userAction.UserActionTypes.USER_PROJECT_UPDATE_SUCCESS:
            return adapter.updateMany(action.payload.map((u: User) => ({ id: u.id, changes: u })), state);
        case userAction.UserActionTypes.USER_PROJECT_ADD_SUCCESS:
            return adapter.updateOne({ id: action.payload.id, changes: action.payload }, state);

        default: {
            return state;
        }
    }
}