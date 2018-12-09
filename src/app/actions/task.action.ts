import { Action } from '@ngrx/store';
import { Task, User, TaskList } from './../domain';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export enum TaskActionTypes {
    TASK_LOAD_BY_LISTS = '[Task] Task Load By lists',
    TASK_LOAD_BY_LISTS_SUCCESS = '[Task] Task Load By lists Success',
    TASK_LOAD_BY_LISTS_FAIL = '[Task] Task Load By lists Fail',
    TASK_ADD = '[Task] Task Add',
    TASK_ADD_SUCCESS = '[Task] Task Add Success',
    TASK_ADD_FAIL = '[Task] Task Add Fail',
    TASK_UPDATE = '[Task] Task Update',
    TASK_UPDATE_SUCCESS = '[Task] Task Update Success',
    TASK_UPDATE_FAIL = '[Task] Task Update Fail',
    TASK_DELETE = '[Task] Task Delete',
    TASK_DELETE_SUCCESS = '[Task] Task Delete Success',
    TASK_DELETE_FAIL = '[Task] Task Delete Fail',
    TASK_MOVE = '[Task] Task Move',
    TASK_MOVE_SUCCESS = '[Task] Task Move Success',
    TASK_MOVE_FAIL = '[Task] Task Move Fail',
    TASK_MOVE_ALL = '[Task] Task Move All',
    TASK_MOVE_ALL_SUCCESS = '[Task] Task Move All Success',
    TASK_MOVE_ALL_FAIL = '[Task] Task Move All Fail',
    TASK_COMPLETE = '[Task] Task Complete',
    TASK_COMPLETE_SUCCESS = '[Task] Task Complete Success',
    TASK_COMPLETE_FAIL = '[Task] Task Complete Fail',
};

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful 
 * type checking in reducer functions.
 */
export class TaskLoadByListsAction implements Action {
    readonly type = TaskActionTypes.TASK_LOAD_BY_LISTS;

    constructor(public payload: TaskList[]) { }
}

export class TaskLoadByListsSuccessAction implements Action {
    readonly type = TaskActionTypes.TASK_LOAD_BY_LISTS_SUCCESS;

    constructor(public payload: Task[]) { }
}

export class TaskLoadByListsFailAction implements Action {
    readonly type = TaskActionTypes.TASK_LOAD_BY_LISTS_FAIL;

    constructor(public payload: string) { }
}

export class TaskAddAction implements Action {
    readonly type = TaskActionTypes.TASK_ADD;

    constructor(public payload: Task) { }
}

export class TaskAddSuccessAction implements Action {
    readonly type = TaskActionTypes.TASK_ADD_SUCCESS;

    constructor(public payload: Task) { }
}

export class TaskAddFailAction implements Action {
    readonly type = TaskActionTypes.TASK_ADD_FAIL;

    constructor(public payload: string) { }
}

export class TaskUpdateAction implements Action {
    readonly type = TaskActionTypes.TASK_UPDATE;

    constructor(public payload: Task) { }
}

export class TaskUpdateSuccessAction implements Action {
    readonly type = TaskActionTypes.TASK_UPDATE_SUCCESS;

    constructor(public payload: Task) { }
}

export class TaskUpdateFailAction implements Action {
    readonly type = TaskActionTypes.TASK_UPDATE_FAIL;

    constructor(public payload: string) { }
}

export class TaskDeleteAction implements Action {
    readonly type = TaskActionTypes.TASK_DELETE;

    constructor(public payload: Task) { }
}

export class TaskDeleteSuccessAction implements Action {
    readonly type = TaskActionTypes.TASK_DELETE_SUCCESS;

    constructor(public payload: Task) { }
}

export class TaskDeleteFailAction implements Action {
    readonly type = TaskActionTypes.TASK_DELETE_FAIL;

    constructor(public payload: string) { }
}

export class TaskMoveAction implements Action {
    readonly type = TaskActionTypes.TASK_MOVE;

    constructor(public payload: { taskId: string, taskListId: string }) { }
}

export class TaskMoveSuccessAction implements Action {
    readonly type = TaskActionTypes.TASK_MOVE_SUCCESS;

    constructor(public payload: Task) { }
}

export class TaskMoveFailAction implements Action {
    readonly type = TaskActionTypes.TASK_MOVE_FAIL;

    constructor(public payload: string) { }
}

export class TaskMoveAllAction implements Action {
    readonly type = TaskActionTypes.TASK_MOVE_ALL;

    constructor(public payload: { srcListId: string, targetListId: string }) { }
}

export class TaskMoveAllSuccessAction implements Action {
    readonly type = TaskActionTypes.TASK_MOVE_ALL_SUCCESS;

    constructor(public payload: Task[]) { }
}

export class TaskMoveAllFailAction implements Action {
    readonly type = TaskActionTypes.TASK_MOVE_ALL_FAIL;

    constructor(public payload: string) { }
}

export class TaskCompleteAction implements Action {
    readonly type = TaskActionTypes.TASK_COMPLETE;

    constructor(public payload: Task) { }
}

export class TaskCompleteSuccessAction implements Action {
    readonly type = TaskActionTypes.TASK_COMPLETE_SUCCESS;

    constructor(public payload: Task) { }
}

export class TaskCompleteFailAction implements Action {
    readonly type = TaskActionTypes.TASK_COMPLETE_FAIL;

    constructor(public payload: string) { }
}
/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type TaskActions
    = TaskAddAction
    | TaskAddSuccessAction
    | TaskAddFailAction
    | TaskLoadByListsAction
    | TaskLoadByListsSuccessAction
    | TaskLoadByListsFailAction
    | TaskUpdateAction
    | TaskUpdateSuccessAction
    | TaskUpdateFailAction
    | TaskDeleteAction
    | TaskDeleteSuccessAction
    | TaskDeleteFailAction
    | TaskMoveAction
    | TaskMoveSuccessAction
    | TaskMoveFailAction
    | TaskMoveAllAction
    | TaskMoveAllSuccessAction
    | TaskMoveAllFailAction
    | TaskCompleteAction
    | TaskCompleteSuccessAction
    | TaskCompleteFailAction;