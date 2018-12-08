import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, concat } from 'rxjs';
import { TaskList } from './../domain';
import { reduce, mapTo } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TaskListService {

    private readonly domain = "taskLists";
    private headers = new HttpHeaders({
        "Content-Type": "application/json"
    });
    constructor(private http: HttpClient, @Inject("BASE_CONFIG") private config) { }

    add(tasklist: TaskList): Observable<TaskList> {
        const url = `${this.config.uri}/${this.domain}`;
        return this.http.post<TaskList>(url, JSON.stringify(tasklist), { headers: this.headers });
    }

    update(tasklist: TaskList): Observable<TaskList> {
        const url = `${this.config.uri}/${this.domain}/${tasklist.id}`;
        const toUpdate = {
            name: tasklist.name
        };
        return this.http.patch<TaskList>(url, JSON.stringify(toUpdate), { headers: this.headers });
    }

    del(tasklist: TaskList): Observable<TaskList> {
        const url = `${this.config.uri}/${this.domain}/${tasklist.id}`;
        return this.http.delete(url).pipe(mapTo(tasklist));
    }

    get(projectId: string): Observable<TaskList[]> {
        const url = `${this.config.uri}/${this.domain}`;
        return this.http.get<TaskList[]>(url, { params: { "projectId": projectId } });
    }

    swapOrder(src: TaskList, target: TaskList): Observable<TaskList[]> {
        const dragUrl = `${this.config.uri}/${this.domain}/${src.id}`;
        const dropUrl = `${this.config.uri}/${this.domain}/${target.id}`;
        const drag$ = this.http.patch<TaskList>(dragUrl, JSON.stringify({ order: target.order }), { headers: this.headers });
        const drop$ = this.http.patch<TaskList>(dropUrl, JSON.stringify({ order: src.order }), { headers: this.headers });
        return concat(drag$, drop$).pipe(reduce<TaskList>((arrs, list) => [...arrs, list], []));
    }
}