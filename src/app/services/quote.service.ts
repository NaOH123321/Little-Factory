import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quote } from './../domain';
import { debug } from '../utils/debug.util';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  constructor(private http: HttpClient, @Inject("BASE_CONFIG") private config) { }

  getQuote(): Observable<Quote> {
    const url = `${this.config.uri}/quotes/${Math.floor(Math.random() * 10)}`;
    return this.http.get<Quote>(url).pipe(
      debug("Quote: ")
    );
  }
}
