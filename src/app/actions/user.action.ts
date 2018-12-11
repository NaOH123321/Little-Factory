import { Action } from '@ngrx/store';
import { User, Project } from './../domain';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export enum UserActionTypes {
    // USER_PROJECTS_LOAD = '[User] User Projects Load',
    // USER_PROJECTS_LOAD_SUCCESS = '[User] User Projects Load Success',
    // USER_PROJECTS_LOAD_FAIL = '[User] User Projects Load Fail',
    // USER_PROJECT_LOAD = '[User] User Project Load',
    // USER_PROJECT_LOAD_SUCCESS = '[User] User Project Load Success',
    // USER_PROJECT_LOAD_FAIL = '[User] User Project Load Fail',
    USERS_LOAD = '[User] Users Load',
    USERS_LOAD_SUCCESS = '[User] Users Load Success',
    USERS_LOAD_FAIL = '[User] Users Load Fail',
    USER_PROJECT_ADD = '[User] User Project Add',
    USER_PROJECT_ADD_SUCCESS = '[User] User Project Add Success',
    USER_PROJECT_ADD_FAIL = '[User] User Project Add Fail',
    USER_PROJECT_UPDATE = '[User] User Project Update',
    USER_PROJECT_UPDATE_SUCCESS = '[User] User Project Update Success',
    USER_PROJECT_UPDATE_FAIL = '[User] User Project Update Fail',
    USER_PROJECT_DELETE = '[User] User Project Delete',
    USER_PROJECT_DELETE_SUCCESS = '[User] User Project Delete Success',
    USER_PROJECT_DELETE_FAIL = '[User] User Project Delete Fail',
    USER_SEARCH = '[User] User Search',
    USER_SEARCH_SUCCESS = '[User] User Search Success',
    USER_SEARCH_FAIL = '[User] User Search Fail',
};

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful 
 * type checking in reducer functions.
 */
// export class UserProjectsLoadAction implements Action {
//     readonly type = UserActionTypes.USER_PROJECTS_LOAD;

//     constructor(public payload: string[]) { }
// }

// export class UserProjectsLoadSuccessAction implements Action {
//     readonly type = UserActionTypes.USER_PROJECTS_LOAD_SUCCESS;

//     constructor(public payload: User[]) { }
// }

// export class UserProjectsLoadFailAction implements Action {
//     readonly type = UserActionTypes.USER_PROJECTS_LOAD_FAIL;

//     constructor(public payload: string) { }
// }

// export class UserProjectLoadAction implements Action {
//     readonly type = UserActionTypes.USER_PROJECT_LOAD;

//     constructor(public payload: string) { }
// }

// export class UserProjectLoadSuccessAction implements Action {
//     readonly type = UserActionTypes.USER_PROJECT_LOAD_SUCCESS;

//     constructor(public payload: User[]) { }
// }

// export class UserProjectLoadFailAction implements Action {
//     readonly type = UserActionTypes.USER_PROJECT_LOAD_FAIL;

//     constructor(public payload: string) { }
// }

export class UsersLoadAction implements Action {
    readonly type = UserActionTypes.USERS_LOAD;

    constructor(public payload: null) { }
}

export class UsersLoadSuccessAction implements Action {
    readonly type = UserActionTypes.USERS_LOAD_SUCCESS;

    constructor(public payload: User[]) { }
}

export class UsersLoadFailAction implements Action {
    readonly type = UserActionTypes.USERS_LOAD_FAIL;

    constructor(public payload: string) { }
}

export class UserProjectAddAction implements Action {
    readonly type = UserActionTypes.USER_PROJECT_ADD;

    constructor(public payload: { user: User, projectId: string }) { }
}

export class UserProjectAddSuccessAction implements Action {
    readonly type = UserActionTypes.USER_PROJECT_ADD_SUCCESS;

    constructor(public payload: User) { }
}

export class UserProjectAddFailAction implements Action {
    readonly type = UserActionTypes.USER_PROJECT_ADD_FAIL;

    constructor(public payload: string) { }
}

export class UserProjectUpdateAction implements Action {
    readonly type = UserActionTypes.USER_PROJECT_UPDATE;

    constructor(public payload: Project) { }
}

export class UserProjectUpdateSuccessAction implements Action {
    readonly type = UserActionTypes.USER_PROJECT_UPDATE_SUCCESS;

    constructor(public payload: User[]) { }
}

export class UserProjectUpdateFailAction implements Action {
    readonly type = UserActionTypes.USER_PROJECT_UPDATE_FAIL;

    constructor(public payload: string) { }
}

export class UserProjectDeleteAction implements Action {
    readonly type = UserActionTypes.USER_PROJECT_DELETE;

    constructor(public payload: Project) { }
}

export class UserProjectDeleteSuccessAction implements Action {
    readonly type = UserActionTypes.USER_PROJECT_DELETE_SUCCESS;

    constructor(public payload: User[]) { }
}

export class UserProjectDeleteFailAction implements Action {
    readonly type = UserActionTypes.USER_PROJECT_DELETE_FAIL;

    constructor(public payload: string) { }
}

export class UserSearchAction implements Action {
    readonly type = UserActionTypes.USER_SEARCH;

    constructor(public payload: string) { }
}

export class UserSearchSuccessAction implements Action {
    readonly type = UserActionTypes.USER_SEARCH_SUCCESS;

    constructor(public payload: User[]) { }
}

export class UserSearchFailAction implements Action {
    readonly type = UserActionTypes.USER_SEARCH_FAIL;

    constructor(public payload: string) { }
}


/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type UserActions
    = UserProjectAddAction
    | UserProjectAddSuccessAction
    | UserProjectAddFailAction
    // | UserProjectLoadAction
    // | UserProjectLoadSuccessAction
    // | UserProjectLoadFailAction
    // | UserProjectsLoadAction
    // | UserProjectsLoadSuccessAction
    // | UserProjectsLoadFailAction
    | UsersLoadAction
    | UsersLoadSuccessAction
    | UsersLoadFailAction
    | UserProjectUpdateAction
    | UserProjectUpdateSuccessAction
    | UserProjectUpdateFailAction
    | UserProjectDeleteAction
    | UserProjectDeleteSuccessAction
    | UserProjectDeleteFailAction
    | UserSearchAction
    | UserSearchSuccessAction
    | UserSearchFailAction;