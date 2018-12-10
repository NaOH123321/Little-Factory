import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity"
import { User } from './../domain';
import * as userAction from '../actions/user.action';
import * as projectAction from '../actions/project.action';

export interface State extends EntityState<User> {
    // additional entities state properties
    selectedUserId: string | null;
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
    selectedUserId: null,
});

function loadUserByProject(state: State, action: projectAction.ProjectSelectAction) {
    const project = action.payload;
    const memberIds = project.members;
    const deleteIds = (<string[]>state.ids).filter(id => memberIds.indexOf(id) === -1);
    return adapter.removeMany(deleteIds, state);
};

function inviteUsers(state: State, action: userAction.UserProjectUpdateSuccessAction) {
    const users = action.payload;
    return adapter.updateMany(users.map((u: User) => ({ id: u.id, changes: u })), state);
}

export function reducer(state = initialState, action: userAction.UserActions | projectAction.ProjectActions): State {
    switch (action.type) {
        case userAction.UserActionTypes.USER_PROJECT_LOAD_SUCCESS:
            return adapter.addAll(action.payload, state);
        case userAction.UserActionTypes.USER_PROJECT_ADD_SUCCESS:
            return adapter.addOne(action.payload, state);
        case userAction.UserActionTypes.USER_PROJECT_DELETE_SUCCESS:
            return adapter.removeOne(action.payload.id, state);
        case userAction.UserActionTypes.USER_PROJECT_UPDATE_SUCCESS:
            return inviteUsers(state, action);
        case userAction.UserActionTypes.USER_SEARCH_SUCCESS:
        default: {
            return state;
        }
    }
}