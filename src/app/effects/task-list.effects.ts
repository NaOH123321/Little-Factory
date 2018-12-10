import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Action, Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as fromRoot from '../reducers';
import * as actions from '../actions/task-list.action';
import * as taskActions from '../actions/task.action';
import { switchMap, map, catchError } from 'rxjs/operators';
import { TaskList, Project, User } from '../domain';
import { TaskListService } from './../services/task-list.service';

@Injectable()
export class TaskListEffects {
    @Effect()
    loadTaskLists$: Observable<Action> = this.actions$.pipe(
        ofType<actions.TaskListLoadAction>(actions.TaskListActionTypes.TASKLIST_LOAD),
        map(action => action.payload),
        switchMap((projectId =>
            this.service$.get(projectId).pipe(
                map(taskLists => new actions.TaskListLoadSuccessAction(taskLists)),
                catchError(err => of(new actions.TaskListLoadFailAction(JSON.stringify(err))))
            )
        ))
    );

    @Effect()
    loadTasks$: Observable<Action> = this.actions$.pipe(
        ofType<actions.TaskListLoadSuccessAction>(actions.TaskListActionTypes.TASKLIST_LOAD_SUCCESS),
        map(action => action.payload),
        map(taskLists => new taskActions.TaskLoadByListsAction(taskLists))
    );
    
    @Effect()
    addTaskList$: Observable<Action> = this.actions$.pipe(
        ofType<actions.TaskListAddAction>(actions.TaskListActionTypes.TASKLIST_ADD),
        map(action => action.payload),
        switchMap(taskList =>
            this.service$.add(taskList).pipe(
                map(tl => new actions.TaskListAddSuccessAction(tl)),
                catchError(err => of(new actions.TaskListAddFailAction(JSON.stringify(err))))
            )
        )
    );

    @Effect()
    updateTaskList$: Observable<Action> = this.actions$.pipe(
        ofType<actions.TaskListUpdateAction>(actions.TaskListActionTypes.TASKLIST_UPDATE),
        map(action => action.payload),
        switchMap(taskList =>
            this.service$.update(taskList).pipe(
                map(tl => new actions.TaskListUpdateSuccessAction(tl)),
                catchError(err => of(new actions.TaskListUpdateFailAction(JSON.stringify(err))))
            )
        )
    );

    @Effect()
    delTaskList$: Observable<Action> = this.actions$.pipe(
        ofType<actions.TaskListDeleteAction>(actions.TaskListActionTypes.TASKLIST_DELETE),
        map(action => action.payload),
        switchMap(taskList =>
            this.service$.del(taskList).pipe(
                map(tl => new actions.TaskListDeleteSuccessAction(tl)),
                catchError(err => of(new actions.TaskListDeleteFailAction(JSON.stringify(err))))
            )
        )
    );

    @Effect()
    swapTaskLists$: Observable<Action> = this.actions$.pipe(
        ofType<actions.TaskListSwapAction>(actions.TaskListActionTypes.TASKLIST_SWAP),
        map(action => action.payload),
        switchMap(({ src, target }) =>
            this.service$.swapOrder(src, target).pipe(
                map(taskLists => new actions.TaskListSwapSuccessAction(taskLists)),
                catchError(err => of(new actions.TaskListSwapFailAction(JSON.stringify(err))))
            )
        )
    );

    constructor(private actions$: Actions, private store$: Store<fromRoot.State>, private service$: TaskListService) { }
}