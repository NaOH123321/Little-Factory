import { Action } from '@ngrx/store';
import { Quote } from './../domain';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export enum QuoteActionTypes {
    QUOTE = '[Quote] Quote',
    QUOTE_SUCCESS = '[Quote] Quote Success',
    QUOTE_FAIL = '[Quote] Quote Fail'
};

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful 
 * type checking in reducer functions.
 */
export class QuoteAction implements Action {
    readonly type = QuoteActionTypes.QUOTE;

    constructor(public payload: null) { }
}

export class QuoteSuccessAction implements Action {
    readonly type = QuoteActionTypes.QUOTE_SUCCESS;

    constructor(public payload: Quote) { }
}

export class QuoteFailAction implements Action {
    readonly type = QuoteActionTypes.QUOTE_FAIL;

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
