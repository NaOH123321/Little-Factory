import { NgModule } from '@angular/core';
import { StoreModule, ActionReducer, ActionReducerMap, MetaReducer, createFeatureSelector, createSelector } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import * as fromQuote from './quote.reducer';
import { environment } from './../../environments/environment';
import { storeFreeze } from 'ngrx-store-freeze'

export interface State {
    quote: fromQuote.State
};

const initialState: State = {
    quote: fromQuote.initialState
};

const reducers: ActionReducerMap<State> = {
    quote: fromQuote.reducer
}

// console.log all actions
export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
    return function (state, action) {
        console.log('state', state);
        console.log('action', action);

        return reducer(state, action);
    };
}

export const metaReducers: MetaReducer<State>[] = !environment.production ? [
    logger,
    storeFreeze
] : [];

export const getQuoteState = createFeatureSelector<fromQuote.State>('quote');

export const getQuote = createSelector(getQuoteState, fromQuote.getQuote);

@NgModule({
    imports: [
        StoreModule.forRoot(reducers, { metaReducers }),
        // RouterStoreModule.connectRouter(),
        StoreRouterConnectingModule,
        !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 50 }) : [],
    ]
})
export class AppStoreModule { }

