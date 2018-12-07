import { NgModule } from '@angular/core';
import { StoreModule, ActionReducer, ActionReducerMap, MetaReducer, createFeatureSelector, createSelector } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { Auth } from './../domain';
import * as fromQuote from './quote.reducer';
import * as fromAuth from './auth.reducer';
import * as fromProject from './project.reducer';
import { environment } from './../../environments/environment';
import { storeFreeze } from 'ngrx-store-freeze'

export interface State {
    quote: fromQuote.State,
    auth: Auth,
    project: fromProject.State
};

const reducers: ActionReducerMap<State> = {
    quote: fromQuote.reducer,
    auth: fromAuth.reducer,
    project: fromProject.reducer
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
export const getAuth = createFeatureSelector<Auth>('auth');
export const getProjectState = createFeatureSelector<fromProject.State>('project');

export const getQuote = createSelector(getQuoteState, fromQuote.getQuote);

export const {
    selectIds: getProjectIds,
    selectEntities: getProjectEntities,
    selectAll: getProjectAll,
    selectTotal: getProjectTotal,
} = fromProject.adapter.getSelectors(getProjectState);

@NgModule({
    imports: [
        StoreModule.forRoot(reducers, { metaReducers }),
        StoreRouterConnectingModule,
        !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 50 }) : [],
    ]
})
export class AppStoreModule { }

