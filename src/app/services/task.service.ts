import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Task, TaskList } from './../domain';
import { mergeMap, count, switchMap, reduce, mapTo } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TaskService {

    private readonly domain = "tasks";
    private headers = new HttpHeaders({
        "Content-Type": "application/json"
    });
    constructor(private http: HttpClient, @Inject("BASE_CONFIG") private config) { }

    add(task: Task): Observable<Task> {
        const url = `${this.config.uri}/${this.domain}`;
        const toAdd = {
            taskListId: task.taskListId,
            desc: task.desc,
            completed: task.completed,
            ownerId: task.ownerId,
            participantIds: task.participantIds,
            dueDate: task.dueDate,
            priority: task.priority,
            remark: task.remark,
            reminder: task.reminder,
            createDate: task.createDate
        };
        return this.http.post<Task>(url, JSON.stringify(toAdd), { headers: this.headers });
    }

    update(task: Task): Observable<Task> {
        const url = `${this.config.uri}/${this.domain}/${task.id}`;
        const toUpdate = {
            desc: task.desc,
            priority: task.priority,
            dueDate: task.dueDate,
            reminder: task.reminder,
            remark: task.remark,
            ownerId: task.ownerId,
            participantIds: task.participantIds
        };
        return this.http.patch<Task>(url, JSON.stringify(toUpdate), { headers: this.headers });
    }

    del(task: Task): Observable<Task> {
        const url = `${this.config.uri}/${this.domain}/${task.id}`;
        return this.http.delete(url).pipe(mapTo(task));
    }

    get(taskListId: string): Observable<Task[]> {
        const url = `${this.config.uri}/${this.domain}`;
        return this.http.get<Task[]>(url, { params: { "taskListId": taskListId } });
    }

    getByLists(lists: TaskList[]): Observable<Task[]> {
        return from(lists).pipe(
            mergeMap(list => this.get(list.id)),
            reduce((tasks: Task[], t: Task[]) => [...tasks, ...t], [])
        );
    }

    complete(task: Task): Observable<Task> {
        const url = `${this.config.uri}/${this.domain}/${task.id}`;
        return this.http.patch<Task>(url, JSON.stringify({ completed: !task.completed }), { headers: this.headers });
    }

    move(taskId: string, taskListId: string): Observable<Task> {
        const url = `${this.config.uri}/${this.domain}/${taskId}`;
        return this.http.patch<Task>(url, JSON.stringify({ taskListId: taskListId }), { headers: this.headers });
    }

    moveAll(srcListId: string, targetListId: string): Observable<Task[]> {
        return this.get(srcListId).pipe(
            mergeMap(tasks => from(tasks)),
            mergeMap(task => this.move(task.id, targetListId)),
            reduce((arr: Task[], x: Task) => [...arr, x], [])
        );
    }

    getAllTasks(userId: string): Observable<Task[]> {
        const url = `${this.config.uri}/${this.domain}`;
        return this.http.get<Task[]>(url, { params: { "ownerId": userId } });
    }
}
