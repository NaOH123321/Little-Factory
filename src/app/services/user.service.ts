import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { User, Project } from './../domain';
import { filter, reduce, switchMap, mergeMap, distinct, tap, map } from 'rxjs/operators';
import { debug } from '../utils/debug.util';
// import * as _ from "lodash";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private readonly domain = "users";
    private headers = new HttpHeaders({
        "Content-Type": "application/json"
    });
    constructor(private http: HttpClient, @Inject("BASE_CONFIG") private config) { }

    search(filter: string): Observable<User[]> {
        const url = `${this.config.uri}/${this.domain}`;
        return this.http.get<User[]>(url, { params: { "email_like": filter } });
    }

    getAllUsers(): Observable<User[]> {
        const url = `${this.config.uri}/${this.domain}`;
        return this.http.get<User[]>(url);
    }

    getUserByProject(projectId: string): Observable<User[]> {
        const url = `${this.config.uri}/${this.domain}`;
        return this.http.get<User[]>(url, { params: { "projectIds_like": projectId } });
    }

    getUserByProjects(projectIds: string[]): Observable<User[]> {
        const url = `${this.config.uri}/${this.domain}`;
        return from(projectIds).pipe(
            mergeMap(projectId => this.getUserByProject(projectId)),
            reduce((users: User[], t: User[]) => [...users, ...t], []),
            switchMap(users =>
                from(users).pipe(
                    distinct(u => u.id),
                    reduce((user: User[], t: User) => [...user, t], []),
                )
            )
        );
    }

    addProjectRef(user: User, projectId: string): Observable<User> {
        const url = `${this.config.uri}/${this.domain}/${user.id}`;
        const projectIds = user.projectIds ? user.projectIds : [];
        if (projectIds.includes(projectId))
            return of(user);
        return this.http.patch<User>(url, JSON.stringify({ projectIds: [...projectIds, projectId] }), { headers: this.headers });
    }

    // removeProjectRef(user: User, projectId: string): Observable<User> {
    //     const url = `${this.config.uri}/${this.domain}/${user.id}`;
    //     const projectIds = user.projectIds ? user.projectIds : [];
    //     const index = projectIds.indexOf(projectId);
    //     if (index === -1)
    //         return of(user);
    //     const toUpdate = projectIds.splice(index, 1);
    //     return this.http.patch<User>(url, JSON.stringify({ projectIds: toUpdate }), { headers: this.headers });
    // }
    removeProjectRef(project: Project): Observable<User[]> {
        const memberIds = project.members;
        return from(memberIds).pipe(
            mergeMap(id => {
                const url = `${this.config.uri}/${this.domain}/${id}`;
                return this.http.get<User>(url);
            }),
            mergeMap(user => {
                const url = `${this.config.uri}/${this.domain}/${user.id}`;
                const projectIds = user.projectIds ? user.projectIds : [];
                const index = projectIds.indexOf(project.id);
                if (index === -1) {
                    return of(user);
                } else {
                    projectIds.splice(index, 1);
                    return this.http.patch<User>(url, JSON.stringify({ projectIds: projectIds }), { headers: this.headers });
                }
            }),
            reduce((acc: User[], curr: User) => [...acc, curr], [])
        );
    }

    batchUpdateProjectRef(project: Project): Observable<User[]> {
        const projectId = project.id;
        const memberIds = project.members ? project.members : [];

        return this.getAllUsers().pipe(
            mergeMap(users => from(users)),
            mergeMap(user => {
                const pIds = user.projectIds !== undefined && user.projectIds !== null ? user.projectIds : [];
                const userId = user.id;
                const index = pIds.indexOf(projectId);
                const url = `${this.config.uri}/${this.domain}/${userId}`;
                if (index !== -1 && memberIds.indexOf(userId) === -1) {
                    pIds.splice(index, 1);
                    return this.http.patch<User>(url, JSON.stringify({ projectIds: pIds }), { headers: this.headers });
                }
                if (index === -1 && memberIds.indexOf(userId) !== -1) {
                    pIds.push(projectId);
                    return this.http.patch<User>(url, JSON.stringify({ projectIds: pIds }), { headers: this.headers });
                }
                return of({ ...user, id: null });
            }),
            filter(user => user.id !== null),
            reduce((acc: User[], curr: User) => [...acc, curr], [])
        );
    }
}
