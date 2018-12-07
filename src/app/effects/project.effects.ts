import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Action, Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as fromRoot from '../reducers';
import * as actions from '../actions/project.action';
import * as routerActions from '../actions/router.action';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { Auth, Project, User } from '../domain';
import { ProjectService } from '../services/project.service';

@Injectable()
export class ProjectEffects {
    @Effect()
    loadProjects$: Observable<Action> = this.actions$.pipe(
        ofType<actions.ProjectActions>(actions.ProjectActionTypes.PROJECT_LOAD),
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
    addProject$: Observable<Action> = this.actions$.pipe(
        ofType<actions.ProjectActions>(actions.ProjectActionTypes.PROJECT_ADD),
        map(action => action.payload),
        withLatestFrom(this.store$.pipe(select(fromRoot.getAuth))),
        switchMap(([project, auth]) => {
            const added = { ...<Project>project, members: [`${auth.userId}`] };
            return this.service$.add(added).pipe(
                map(project => new actions.ProjectAddSuccessAction(project)),
                catchError(err => of(new actions.ProjectAddFailAction(JSON.stringify(err))))
            )
        })
    );

    @Effect()
    updateProject$: Observable<Action> = this.actions$.pipe(
        ofType<actions.ProjectActions>(actions.ProjectActionTypes.PROJECT_UPDATE),
        map(action => action.payload),
        switchMap((project: Project) =>
            this.service$.update(project).pipe(
                map(project => new actions.ProjectUpdateSuccessAction(project)),
                catchError(err => of(new actions.ProjectUpdateFailAction(JSON.stringify(err))))
            )
        )
    );

    @Effect()
    delProject$: Observable<Action> = this.actions$.pipe(
        ofType<actions.ProjectActions>(actions.ProjectActionTypes.PROJECT_DELETE),
        map(action => action.payload),
        switchMap((project: Project) =>
            this.service$.del(project).pipe(
                map(project => new actions.ProjectDeleteSuccessAction(project)),
                catchError(err => of(new actions.ProjectDeleteFailAction(JSON.stringify(err))))
            )
        )
    );

    @Effect()
    selectProject$: Observable<Action> = this.actions$.pipe(
        ofType<actions.ProjectActions>(actions.ProjectActionTypes.PROJECT_SELECT),
        map(action => action.payload),
        map((project: Project) => new routerActions.GoAction({ path: [`/tasklists/${project.id}`] }))
    );

    @Effect()
    inviteProject$: Observable<Action> = this.actions$.pipe(
        ofType<actions.ProjectActions>(actions.ProjectActionTypes.PROJECT_INVITE),
        map(action => action.payload),
        switchMap((project: { projectId: string, members: User[] }) =>
            this.service$.invite(project.projectId, project.members).pipe(
                map(project => new actions.ProjectInviteSuccessAction(project)),
                catchError(err => of(new actions.ProjectInviteFailAction(JSON.stringify(err))))
            )
        )
    );
    constructor(private actions$: Actions, private store$: Store<fromRoot.State>, private service$: ProjectService) { }
}