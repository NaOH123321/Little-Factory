import { Action } from '@ngrx/store';
import { Quote } from './../domain';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export enum QuoteActionTypes {
    QuoteAction = '[Quote] Quote',
    QuoteSuccessAction = '[Quote] Quote Success',
    QuoteFailAction = '[Quote] Quote Fail'
};

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful 
 * type checking in reducer functions.
 */
export class QuoteAction implements Action {
    readonly type = QuoteActionTypes.QuoteAction;

    constructor(public payload: null) { }
}

export class QuoteSuccessAction implements Action {
    readonly type = QuoteActionTypes.QuoteSuccessAction;

    constructor(public payload: Quote) { }
}

export class QuoteFailAction implements Action {
    readonly type = QuoteActionTypes.QuoteFailAction;

    constructor(public payload: string) { }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type QuoteActions
    = QuoteAction
    | QuoteSuccessAction
    | QuoteFailAction;
