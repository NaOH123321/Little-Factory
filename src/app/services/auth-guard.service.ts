import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Store, select } from "@ngrx/store";
import { map, defaultIfEmpty } from "rxjs/operators";
import * as fromRoot from '../reducers';
import * as routerActions from './../actions/router.action';
import { debug } from "../utils/debug.util";

@Injectable()
export class AuthGuardService implements CanActivate {
    
    constructor(private store$: Store<fromRoot.State>) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.store$.pipe(
            select(fromRoot.getAuth),
            map(auth => {
                const result = auth.token !== null && auth.token !== undefined;
                if (!result)
                    this.store$.dispatch(new routerActions.GoAction({ path: ['/login'] }));
                return result;
            }),
            defaultIfEmpty(false),
        );
    }
}