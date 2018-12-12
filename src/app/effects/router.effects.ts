import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import * as actions from '../actions/router.action';
import { tap, map } from 'rxjs/operators';

@Injectable()
export class RouterEffects {
    @Effect({ dispatch: false })
    navigate$ = this.actions$.pipe(
        ofType<actions.GoAction>(actions.RouterActionTypes.GO),
        map(action => action.payload),
        tap(({ path, queryParams: queryParams }) =>
            this.router.navigate(path, { queryParams })
        )
    );

    constructor(private actions$: Actions, private router: Router) { }
}