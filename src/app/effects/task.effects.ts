import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Action, Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as fromRoot from '../reducers';
import * as actions from '../actions/task.action';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Task, Project, User } from '../domain';
import { TaskService } from './../services/task.service';

@Injectable()
export class TaskEffects {
    @Effect()
    loadTasks$: Observable<Action> = this.actions$.pipe(
        ofType<actions.TaskLoadByListsAction>(actions.TaskActionTypes.TASK_LOAD_BY_LISTS),
        map(action => action.payload),
        switchMap((taskLists =>
            this.service$.getByLists(taskLists).pipe(
                map(tasks => new actions.TaskLoadByListsSuccessAction(tasks)),
                catchError(err => of(new actions.TaskLoadByListsFailAction(JSON.stringify(err))))
            )
        ))
    );

    @Effect()
    addTask$: Observable<Action> = this.actions$.pipe(
        ofType<actions.TaskAddAction>(actions.TaskActionTypes.TASK_ADD),
        map(action => action.payload),
        switchMap(task =>
            this.service$.add(task).pipe(
                map(t => new actions.TaskAddSuccessAction(t)),
                catchError(err => of(new actions.TaskAddFailAction(JSON.stringify(err))))
            )
        )
    );

    @Effect()
    updateTask$: Observable<Action> = this.actions$.pipe(
        ofType<actions.TaskUpdateAction>(actions.TaskActionTypes.TASK_UPDATE),
        map(action => action.payload),
        switchMap(task =>
            this.service$.update(task).pipe(
                map(t => new actions.TaskUpdateSuccessAction(t)),
                catchError(err => of(new actions.TaskUpdateFailAction(JSON.stringify(err))))
            )
        )
    );

    @Effect()
    delTask$: Observable<Action> = this.actions$.pipe(
        ofType<actions.TaskDeleteAction>(actions.TaskActionTypes.TASK_DELETE),
        map(action => action.payload),
        switchMap(task =>
            this.service$.del(task).pipe(
                map(t => new actions.TaskDeleteSuccessAction(t)),
                catchError(err => of(new actions.TaskDeleteFailAction(JSON.stringify(err))))
            )
        )
    );

    @Effect()
    moveTask$: Observable<Action> = this.actions$.pipe(
        ofType<actions.TaskMoveAction>(actions.TaskActionTypes.TASK_MOVE),
        map(action => action.payload),
        switchMap(({ taskId, taskListId }) =>
            this.service$.move(taskId, taskListId).pipe(
                map(task => new actions.TaskMoveSuccessAction(task)),
                catchError(err => of(new actions.TaskMoveFailAction(JSON.stringify(err))))
            )
        )
    );

    @Effect()
    moveAllTasks$: Observable<Action> = this.actions$.pipe(
        ofType<actions.TaskMoveAllAction>(actions.TaskActionTypes.TASK_MOVE_ALL),
        map(action => action.payload),
        switchMap(({ srcListId, targetListId }) =>
            this.service$.moveAll(srcListId, targetListId).pipe(
                map(taskLists => new actions.TaskMoveAllSuccessAction(taskLists)),
                catchError(err => of(new actions.TaskMoveAllFailAction(JSON.stringify(err))))
            )
        )
    );

    @Effect()
    completeTask$: Observable<Action> = this.actions$.pipe(
        ofType<actions.TaskCompleteAction>(actions.TaskActionTypes.TASK_COMPLETE),
        map(action => action.payload),
        switchMap(task =>
            this.service$.complete(task).pipe(
                map(t => new actions.TaskCompleteSuccessAction(t)),
                catchError(err => of(new actions.TaskCompleteFailAction(JSON.stringify(err))))
            )
        )
    );
    constructor(private actions$: Actions, private store$: Store<fromRoot.State>, private service$: TaskService) { }
}