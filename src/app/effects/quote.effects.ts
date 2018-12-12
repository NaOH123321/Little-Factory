import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { QuoteService } from '../services/quote.service';
import * as actions from '../actions/quote.action';
import { switchMap, map, catchError } from 'rxjs/operators';

@Injectable()
export class QuoteEffects {
    @Effect()
    getQuote$: Observable<Action> = this.actions$.pipe(
        ofType<actions.QuoteAction>(actions.QuoteActionTypes.QUOTE),
        map(action => action.payload),
        switchMap(_ =>
            this.service$.getQuote().pipe(
                map(quote => new actions.QuoteSuccessAction(quote)),
                catchError(err => of(new actions.QuoteFailAction(JSON.stringify(err))))
            )
        )
    );
    constructor(private actions$: Actions, private service$: QuoteService) { }
}