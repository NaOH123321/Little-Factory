import { Action } from '@ngrx/store';
import { Project, User } from './../domain';
import { Update } from '@ngrx/entity';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export enum ProjectActionTypes {
    PROJECT_LOAD = '[Project] Project Load',
    PROJECT_LOAD_SUCCESS = '[Project] Project Load Success',
    PROJECT_LOAD_FAIL = '[Project] Project Load Fail',
    PROJECT_ADD = '[Project] Project Add',
    PROJECT_ADD_SUCCESS = '[Project] Project Add Success',
    PROJECT_ADD_FAIL = '[Project] Project Add Fail',
    PROJECT_UPDATE = '[Project] Project Update',
    PROJECT_UPDATE_SUCCESS = '[Project] Project Update Success',
    PROJECT_UPDATE_FAIL = '[Project] Project Update Fail',
    PROJECT_DELETE = '[Project] Project Delete',
    PROJECT_DELETE_SUCCESS = '[Project] Project Delete Success',
    PROJECT_DELETE_FAIL = '[Project] Project Delete Fail',
    PROJECT_INVITE = '[Project] Project Invite',
    PROJECT_INVITE_SUCCESS = '[Project] Project Invite Success',
    PROJECT_INVITE_FAIL = '[Project] Project Invite Fail',
    PROJECT_SELECT = '[Project] Project select',
};

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful 
 * type checking in reducer functions.
 */
export class ProjectLoadAction implements Action {
    readonly type = ProjectActionTypes.PROJECT_LOAD;

    constructor(public payload: null) { }
}

export class ProjectLoadSuccessAction implements Action {
    readonly type = ProjectActionTypes.PROJECT_LOAD_SUCCESS;

    constructor(public payload: Project[]) { }
}

export class ProjectLoadFailAction implements Action {
    readonly type = ProjectActionTypes.PROJECT_LOAD_FAIL;

    constructor(public payload: string) { }
}

export class ProjectAddAction implements Action {
    readonly type = ProjectActionTypes.PROJECT_ADD;

    constructor(public payload: Project) { }
}

export class ProjectAddSuccessAction implements Action {
    readonly type = ProjectActionTypes.PROJECT_ADD_SUCCESS;

    constructor(public payload: Project) { }
}

export class ProjectAddFailAction implements Action {
    readonly type = ProjectActionTypes.PROJECT_ADD_FAIL;

    constructor(public payload: string) { }
}

export class ProjectUpdateAction implements Action {
    readonly type = ProjectActionTypes.PROJECT_UPDATE;

    constructor(public payload: Project) { }
}

export class ProjectUpdateSuccessAction implements Action {
    readonly type = ProjectActionTypes.PROJECT_UPDATE_SUCCESS;

    constructor(public payload: Project) { }
}

export class ProjectUpdateFailAction implements Action {
    readonly type = ProjectActionTypes.PROJECT_UPDATE_FAIL;

    constructor(public payload: string) { }
}

export class ProjectDeleteAction implements Action {
    readonly type = ProjectActionTypes.PROJECT_DELETE;

    constructor(public payload: Project) { }
}

export class ProjectDeleteSuccessAction implements Action {
    readonly type = ProjectActionTypes.PROJECT_DELETE_SUCCESS;

    constructor(public payload: Project) { }
}

export class ProjectDeleteFailAction implements Action {
    readonly type = ProjectActionTypes.PROJECT_DELETE_FAIL;

    constructor(public payload: string) { }
}

export class ProjectInviteAction implements Action {
    readonly type = ProjectActionTypes.PROJECT_INVITE;

    constructor(public payload: { projectId: string, members: User[] }) { }
}

export class ProjectInviteSuccessAction implements Action {
    readonly type = ProjectActionTypes.PROJECT_INVITE_SUCCESS;

    constructor(public payload: Project) { }
}

export class ProjectInviteFailAction implements Action {
    readonly type = ProjectActionTypes.PROJECT_INVITE_FAIL;

    constructor(public payload: string) { }
}

export class ProjectSelectAction implements Action {
    readonly type = ProjectActionTypes.PROJECT_SELECT;

    constructor(public payload: Project) { }
}
/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type ProjectActions
    = ProjectAddAction
    | ProjectAddSuccessAction
    | ProjectAddFailAction
    | ProjectLoadAction
    | ProjectLoadSuccessAction
    | ProjectLoadFailAction
    | ProjectUpdateAction
    | ProjectUpdateSuccessAction
    | ProjectUpdateFailAction
    | ProjectDeleteAction
    | ProjectDeleteSuccessAction
    | ProjectDeleteFailAction
    | ProjectInviteAction
    | ProjectInviteSuccessAction
    | ProjectInviteFailAction
    | ProjectSelectAction;