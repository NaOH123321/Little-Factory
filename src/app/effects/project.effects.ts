import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { Action, Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as fromRoot from '../reducers';
import * as actions from '../actions/project.action';
import * as routerActions from '../actions/router.action';
import * as taskListActions from '../actions/task-list.action';
import * as userActions from '../actions/user.action';
import { switchMap, map, catchError, withLatestFrom, take } from 'rxjs/operators';
import { Auth, Project, User } from '../domain';
import { ProjectService } from '../services/project.service';
import { UserService } from '../services/user.service';

@Injectable()
export class ProjectEffects {
    @Effect()
    loadProjects$: Observable<Action> = this.actions$.pipe(
        ofType<actions.ProjectLoadAction>(actions.ProjectActionTypes.PROJECT_LOAD),
        map(action => action.payload),
        withLatestFrom(this.store$.pipe(select(fromRoot.getAuth))),
        switchMap(([_, auth]) =>
            this.service$.get(auth.userId).pipe(
                map(projects => new actions.ProjectLoadSuccessAction(projects)),
                catchError(err => of(new actions.ProjectLoadFailAction(JSON.stringify(err))))
            )
        )
    );

    @Effect()
    toLoadUser$: Observable<Action> = this.actions$.pipe(
        ofType<actions.ProjectLoadSuccessAction>(actions.ProjectActionTypes.PROJECT_LOAD_SUCCESS),
        map(action => action.payload),
        map(projects => projects.map(prj => prj.id)),
        map(projectIds => new userActions.UsersLoadAction(null)),
    );

    @Effect()
    addProject$: Observable<Action> = this.actions$.pipe(
        ofType<actions.ProjectAddAction>(actions.ProjectActionTypes.PROJECT_ADD),
        map(action => action.payload),
        withLatestFrom(this.store$.pipe(select(fromRoot.getAuth))),
        switchMap(([project, auth]) => {
            const added = { ...<Project>project, members: [`${auth.userId}`] };
            return this.service$.add(added).pipe(
                map(prj => new actions.ProjectAddSuccessAction(prj)),
                catchError(err => of(new actions.ProjectAddFailAction(JSON.stringify(err))))
            );
        })
    );

    @Effect()
    addUsersByProject$: Observable<Action> = this.actions$.pipe(
        ofType<actions.ProjectAddSuccessAction>(actions.ProjectActionTypes.PROJECT_ADD_SUCCESS),
        map(action => action.payload),
        withLatestFrom(this.store$.pipe(select(fromRoot.getAuthUser))),
        map(([project, user]) => new userActions.UserProjectAddAction({ projectId: project.id, user: user }))
    );

    @Effect()
    updateProject$: Observable<Action> = this.actions$.pipe(
        ofType<actions.ProjectUpdateAction>(actions.ProjectActionTypes.PROJECT_UPDATE),
        map(action => action.payload),
        switchMap(project =>
            this.service$.update(project).pipe(
                map(prj => new actions.ProjectUpdateSuccessAction(prj)),
                catchError(err => of(new actions.ProjectUpdateFailAction(JSON.stringify(err))))
            )
        )
    );

    @Effect()
    delProject$: Observable<Action> = this.actions$.pipe(
        ofType<actions.ProjectDeleteAction>(actions.ProjectActionTypes.PROJECT_DELETE),
        map(action => action.payload),
        switchMap(project =>
            this.service$.del(project).pipe(
                map(prj => new actions.ProjectDeleteSuccessAction(prj)),
                catchError(err => of(new actions.ProjectDeleteFailAction(JSON.stringify(err))))
            )
        )
    );

    @Effect()
    removeUsersByProject$: Observable<Action> = this.actions$.pipe(
        ofType<actions.ProjectDeleteSuccessAction>(actions.ProjectActionTypes.PROJECT_DELETE_SUCCESS),
        map(action => action.payload),
        map(project => new userActions.UserProjectDeleteAction(project))
    );

    @Effect()
    selectProject$: Observable<Action> = this.actions$.pipe(
        ofType<actions.ProjectSelectAction>(actions.ProjectActionTypes.PROJECT_SELECT),
        map(action => action.payload),
        map(project => new routerActions.GoAction({ path: [`/tasklists/${project.id}`] }))
    );

    @Effect()
    loadTaskLists$: Observable<Action> = this.actions$.pipe(
        ofType<actions.ProjectSelectAction>(actions.ProjectActionTypes.PROJECT_SELECT),
        map(action => action.payload),
        map(project => new taskListActions.TaskListLoadAction(project.id))
    );

    // @Effect()
    // loadUsersByProject$: Observable<Action> = this.actions$.pipe(
    //     ofType<actions.ProjectSelectAction>(actions.ProjectActionTypes.PROJECT_SELECT),
    //     map(action => action.payload),
    //     map(project => new userActions.UserProjectLoadAction(project.id))
    // );

    @Effect()
    inviteProject$: Observable<Action> = this.actions$.pipe(
        ofType<actions.ProjectInviteAction>(actions.ProjectActionTypes.PROJECT_INVITE),
        map(action => action.payload),
        switchMap(({ projectId, members }) =>
            this.service$.invite(projectId, members).pipe(
                map(project => new actions.ProjectInviteSuccessAction(project)),
                catchError(err => of(new actions.ProjectInviteFailAction(JSON.stringify(err))))
            )
        )
    );

    @Effect()
    updateUsersByProject$: Observable<Action> = this.actions$.pipe(
        ofType<actions.ProjectInviteSuccessAction>(actions.ProjectActionTypes.PROJECT_INVITE_SUCCESS),
        map(action => action.payload),
        map(project => new userActions.UserProjectUpdateAction(project))
    );
    constructor(private actions$: Actions,
        private store$: Store<fromRoot.State>,
        private service$: ProjectService,
        private userService$: UserService, ) { }
}