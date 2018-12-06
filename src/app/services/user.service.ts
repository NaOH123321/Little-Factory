import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { User, Project } from './../domain';
import { filter, reduce, switchMap } from 'rxjs/operators';

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

    getUserByProject(projectId: string): Observable<User[]> {
        const url = `${this.config.uri}/${this.domain}`;
        return this.http.get<User[]>(url, { params: { "projectId": projectId } });
    }

    addProjectRef(user: User, projectId: string): Observable<User> {
        const url = `${this.config.uri}/${this.domain}/${user.id}`;
        const projectIds = user.projectIds ? user.projectIds : [];
        if (projectIds.includes(projectId))
            return of(user);
        return this.http.patch<User>(url, JSON.stringify({ projectIds: [...projectIds, projectId] }), { headers: this.headers });
    }

    removeProjectRef(user: User, projectId: string): Observable<User> {
        const url = `${this.config.uri}/${this.domain}/${user.id}`;
        const projectIds = user.projectIds ? user.projectIds : [];
        const index = projectIds.indexOf(projectId);
        if (index === -1)
            return of(user);
        const toUpdate = [...projectIds.slice(0, index), ...projectIds.slice(index + 1)];
        return this.http.patch<User>(url, JSON.stringify({ projectIds: toUpdate }), { headers: this.headers });
    }

    batchUpdateProjectRef(project: Project): Observable<User[]> {
        const projectId = project.id;
        const memberIds = project.members ? project.members : [];
        return from(memberIds).pipe(
            switchMap(id => {
                const url = `${this.config.uri}/${this.domain}/${id}`;
                return this.http.get<User>(url);
            }),
            filter(user => user.projectIds.indexOf(projectId) === -1),
            switchMap(u => this.addProjectRef(u, projectId)),
            reduce((acc: User[], curr: User) => [...acc, curr], [])
        );
    }
}
