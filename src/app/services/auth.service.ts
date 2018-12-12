import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { Auth, User } from './../domain';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly domain = "users";
    private headers = new HttpHeaders({
        "Content-Type": "application/json"
    });

    private token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
        '.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9' +
        '.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';

    constructor(private http: HttpClient, @Inject("BASE_CONFIG") private config) { }

    register(user: User): Observable<Auth> {
        const url = `${this.config.uri}/${this.domain}`;
        return this.http.get<User[]>(url, { params: { "email": user.email } }).pipe(
            switchMap(res => {
                if (res.length > 0)
                    throw new Error("user existed");
                return this.http.post<User>(url, JSON.stringify(user), { headers: this.headers }).pipe(
                    map(r => ({ token: this.token, user: r, userId: r.id }))
                );
            })
        );
    }

    login(username: string, password: string): Observable<Auth> {
        const url = `${this.config.uri}/${this.domain}`;
        return this.http.get<User[]>(url, { params: { "email": username, "password": password } }).pipe(
            map(res => {
                if (res.length === 0)
                    throw new Error('Username or password incorrect');
                return {
                    token: this.token,
                    user: res[0],
                    userId: res[0].id
                };
            })
        );
    }

}
