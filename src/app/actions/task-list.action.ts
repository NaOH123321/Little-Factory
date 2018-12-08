import { Action } from '@ngrx/store';
import { TaskList, User } from './../domain';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export enum TaskListActionTypes {
    TASKLIST_LOAD = '[TaskList] TaskList Load',
    TASKLIST_LOAD_SUCCESS = '[TaskList] TaskList Load Success',
    TASKLIST_LOAD_FAIL = '[TaskList] TaskList Load Fail',
    TASKLIST_ADD = '[TaskList] TaskList Add',
    TASKLIST_ADD_SUCCESS = '[TaskList] TaskList Add Success',
    TASKLIST_ADD_FAIL = '[TaskList] TaskList Add Fail',
    TASKLIST_UPDATE = '[TaskList] TaskList Update',
    TASKLIST_UPDATE_SUCCESS = '[TaskList] TaskList Update Success',
    TASKLIST_UPDATE_FAIL = '[TaskList] TaskList Update Fail',
    TASKLIST_DELETE = '[TaskList] TaskList Delete',
    TASKLIST_DELETE_SUCCESS = '[TaskList] TaskList Delete Success',
    TASKLIST_DELETE_FAIL = '[TaskList] TaskList Delete Fail',
    TASKLIST_SWAP = '[TaskList] TaskList Swap',
    TASKLIST_SWAP_SUCCESS = '[TaskList] TaskList Swap Success',
    TASKLIST_SWAP_FAIL = '[TaskList] TaskList Swap Fail',
};

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful 
 * type checking in reducer functions.
 */
export class TaskListLoadAction implements Action {
    readonly type = TaskListActionTypes.TASKLIST_LOAD;

    constructor(public payload: string) { }
}

export class TaskListLoadSuccessAction implements Action {
    readonly type = TaskListActionTypes.TASKLIST_LOAD_SUCCESS;

    constructor(public payload: TaskList[]) { }
}

export class TaskListLoadFailAction implements Action {
    readonly type = TaskListActionTypes.TASKLIST_LOAD_FAIL;

    constructor(public payload: string) { }
}

export class TaskListAddAction implements Action {
    readonly type = TaskListActionTypes.TASKLIST_ADD;

    constructor(public payload: TaskList) { }
}

export class TaskListAddSuccessAction implements Action {
    readonly type = TaskListActionTypes.TASKLIST_ADD_SUCCESS;

    constructor(public payload: TaskList) { }
}

export class TaskListAddFailAction implements Action {
    readonly type = TaskListActionTypes.TASKLIST_ADD_FAIL;

    constructor(public payload: string) { }
}

export class TaskListUpdateAction implements Action {
    readonly type = TaskListActionTypes.TASKLIST_UPDATE;

    constructor(public payload: TaskList) { }
}

export class TaskListUpdateSuccessAction implements Action {
    readonly type = TaskListActionTypes.TASKLIST_UPDATE_SUCCESS;

    constructor(public payload: TaskList) { }
}

export class TaskListUpdateFailAction implements Action {
    readonly type = TaskListActionTypes.TASKLIST_UPDATE_FAIL;

    constructor(public payload: string) { }
}

export class TaskListDeleteAction implements Action {
    readonly type = TaskListActionTypes.TASKLIST_DELETE;

    constructor(public payload: TaskList) { }
}

export class TaskListDeleteSuccessAction implements Action {
    readonly type = TaskListActionTypes.TASKLIST_DELETE_SUCCESS;

    constructor(public payload: TaskList) { }
}

export class TaskListDeleteFailAction implements Action {
    readonly type = TaskListActionTypes.TASKLIST_DELETE_FAIL;

    constructor(public payload: string) { }
}

export class TaskListSwapAction implements Action {
    readonly type = TaskListActionTypes.TASKLIST_SWAP;

    constructor(public payload: { src: TaskList, target: TaskList }) { }
}

export class TaskListSwapSuccessAction implements Action {
    readonly type = TaskListActionTypes.TASKLIST_SWAP_SUCCESS;

    constructor(public payload: TaskList[]) { }
}

export class TaskListSwapFailAction implements Action {
    readonly type = TaskListActionTypes.TASKLIST_SWAP_FAIL;

    constructor(public payload: string) { }
}


/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type TaskListActions
    = TaskListAddAction
    | TaskListAddSuccessAction
    | TaskListAddFailAction
    | TaskListLoadAction
    | TaskListLoadSuccessAction
    | TaskListLoadFailAction
    | TaskListUpdateAction
    | TaskListUpdateSuccessAction
    | TaskListUpdateFailAction
    | TaskListDeleteAction
    | TaskListDeleteSuccessAction
    | TaskListDeleteFailAction
    | TaskListSwapAction
    | TaskListSwapSuccessAction
    | TaskListSwapFailAction;