import { Action } from '@ngrx/store';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export enum RouterActionTypes {
    GO = '[Router] Router Go',
    BACK = '[Router] Router Back'
};

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful 
 * type checking in reducer functions.
 */
export class GoAction implements Action {
    readonly type = RouterActionTypes.GO;

    constructor(public payload: { path: any[], queryParams?: object }) { }
}

export class BackAction implements Action {
    readonly type = RouterActionTypes.BACK;

    constructor(public payload: null) { }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type ClassActions
    = GoAction
    | BackAction;
