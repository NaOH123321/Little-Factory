import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Project } from './../domain';
import { mergeMap, count, switchMap, mapTo } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private readonly domain = "projects";
  private headers = new HttpHeaders({
    "Content-Type": "application/json"
  });
  constructor(private http: HttpClient, @Inject("BASE_CONFIG") private config) { }

  add(project: Project): Observable<Project> {
    project.id = null;
    const url = `${this.config.uri}/${this.domain}`;
    return this.http.post<Project>(url, JSON.stringify(project), { headers: this.headers });
  }

  update(project: Project): Observable<Project> {
    const url = `${this.config.uri}/${this.domain}/${project.id}`;
    const toUpdate = {
      name: project.name,
      desc: project.desc,
      coverImg: project.coverImg
    };
    return this.http.patch<Project>(url, JSON.stringify(toUpdate), { headers: this.headers });
  }

  del(project: Project): Observable<Project> {
    const delTasks$ = from(project.taskLists ? project.taskLists : []).pipe(
      mergeMap(listId => this.http.delete(`${this.config.uri}/taskLists/${listId}`)),
      count()
    );
    const url = `${this.config.uri}/${this.domain}/${project.id}`;
    return delTasks$.pipe(
      switchMap(_ => this.http.delete(url).pipe(mapTo(project)))
    );
  }

  get(userId: string): Observable<Project[]> {
    const url = `${this.config.uri}/${this.domain}`;
    return this.http.get<Project[]>(url, { params: { "members_like": userId } });
  }

}
