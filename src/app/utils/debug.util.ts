import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { environment } from './../../environments/environment';

export const debug = <T>(message: string) => tap<T>(
    (next) => {
        if (!environment.production) {
            console.log(message, next);
        }
    },
    (err) => {
        if (!environment.production) {
            console.error("ERROR>>", message, err);
        }
    },
    () => {
        if (!environment.production) {
            console.log("Complete -");
        }
    },
);

const userDefined = <T>(source: Observable<T>) => new Observable<T>((subscriber) => {
    source.subscribe({
        next(value) { subscriber.next(value); },
        error(err) { subscriber.error(err); },
        complete() { subscriber.complete(); },
    });
});


