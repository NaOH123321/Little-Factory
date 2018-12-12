import { NgModule } from '@angular/core';
import { StoreModule, ActionReducer, ActionReducerMap, MetaReducer, createFeatureSelector, createSelector } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { Auth } from './../domain';
import * as authActions from '../actions/auth.action';
import * as fromQuote from './quote.reducer';
import * as fromAuth from './auth.reducer';
import * as fromProject from './project.reducer';
import * as fromTaskList from './task-list.reducer';
import * as fromTask from './task.reducer';
import * as fromUser from './user.reducer';
import { environment } from './../../environments/environment';
import { storeFreeze } from 'ngrx-store-freeze';
import { TaskVM } from '../vm/task.vm';
import { TaskListVM } from '../vm/task-list.vm';

export interface State {
    quote: fromQuote.State;
    auth: Auth;
    project: fromProject.State;
    taskList: fromTaskList.State;
    task: fromTask.State;
    user: fromUser.State;
};

const reducers: ActionReducerMap<State> = {
    quote: fromQuote.reducer,
    auth: fromAuth.reducer,
    project: fromProject.reducer,
    taskList: fromTaskList.reducer,
    task: fromTask.reducer,
    user: fromUser.reducer
};

// console.log all actions
export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
    return function (state, action) {
        console.log('state', state);
        console.log('action', action);

        return reducer(state, action);
    };
}

export function storeLoginGuard(reducer: ActionReducer<State>): ActionReducer<State> {
    return function (state, action) {
        if (action.type === authActions.AuthActionTypes.AUTH_LOGOUT)
            return reducer(undefined, action);
        return reducer(state, action);
    };
}

export const metaReducers: MetaReducer<State>[] = !environment.production ? [
    logger,
    storeFreeze,
    storeLoginGuard
] : [storeLoginGuard];

export const getQuoteState = createFeatureSelector<fromQuote.State>('quote');
export const getAuth = createFeatureSelector<Auth>('auth');
export const getProjectState = createFeatureSelector<fromProject.State>('project');
export const getTaskListState = createFeatureSelector<fromTaskList.State>('taskList');
export const getTaskState = createFeatureSelector<fromTask.State>('task');
export const getUserState = createFeatureSelector<fromUser.State>('user');

export const getQuote = createSelector(getQuoteState, fromQuote.getQuote);

export const {
    selectIds: getProjectIds,
    selectEntities: getProjectEntities,
    selectAll: getProjectAll,
    selectTotal: getProjectTotal,
} = fromProject.adapter.getSelectors(getProjectState);

export const {
    selectIds: getTaskListIds,
    selectEntities: getTaskListEntities,
    selectAll: getTaskListAll,
    selectTotal: getTaskListTotal,
} = fromTaskList.adapter.getSelectors(getTaskListState);

export const {
    selectIds: getTaskIds,
    selectEntities: getTaskEntities,
    selectAll: getTaskAll,
    selectTotal: getTaskTotal,
} = fromTask.adapter.getSelectors(getTaskState);

export const {
    selectIds: getUserIds,
    selectEntities: getUserEntities,
    selectAll: getUserAll,
    selectTotal: getUserTotal,
} = fromUser.adapter.getSelectors(getUserState);

export const getAuthUser = createSelector(getAuth, getUserEntities, (auth, userEntities) => {
    return userEntities[auth.userId];
});

export const getProjectMembers = (projectId: string) => createSelector(getProjectState, getUserEntities, (state, entities) => {
    const prj = state.entities[projectId];
    if (!prj || !prj.members) {
        return [];
    }
    return prj.members.map((id: string) => entities[id]);
});

const getSelectedProjectId = createSelector(getProjectState, fromProject.getSelectedId);

const getTaskLists = createSelector(getTaskListAll, getSelectedProjectId, (taskLists, projectId) => {
    return taskLists.filter(taskList => taskList.projectId === projectId);
});

export const getTasksWithOwners = createSelector(getTaskAll, getUserEntities, (tasks, userEntities) => {
    return <TaskVM[]>tasks.map(task => {
        return {
            ...task,
            owner: userEntities[task.ownerId],
            participants:
                task.participantIds !== null && task.participantIds !== undefined ?
                    task.participantIds.map(id => userEntities[id]) : []
        };
    });
});

export const getTaskListsByProject = createSelector(getTaskLists, getTasksWithOwners, (taskLists, tasks) => {
    return <TaskListVM[]>taskLists.map(taskList => {
        return {
            ...taskList,
            tasks: tasks.filter(task => task.taskListId === taskList.id)
        };
    });
});

@NgModule({
    imports: [
        StoreModule.forRoot(reducers, { metaReducers }),
        StoreRouterConnectingModule,
        !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 50 }) : [],
    ]
})
export class AppStoreModule { }

