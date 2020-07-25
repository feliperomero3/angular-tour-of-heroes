import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Hero } from './hero';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'api/heroes';
  private httpOptions: {
    headers: { 'Content-Type': 'application/json' }
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap(() => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  getHero(id: number): Observable<Hero> {
    return this.http.get<Hero>(`${this.heroesUrl}/${id}`).pipe(
      tap(() => this.log(`fetched hero ${id}`)),
      catchError(this.handleError<Hero>('getHero'))
    );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(() => this.log(`updated hero ${hero.id}`)),
      catchError(this.handleError<any>('updatedHero'))
    );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero ${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  deleteHero(hero: Hero | number): Observable<any> {
    const id = typeof hero == 'number' ? hero : hero.id;
    return this.http.delete<Hero>(`${this.heroesUrl}/${id}`, this.httpOptions).pipe(
      tap(() => `deleted hero ${id}`),
      catchError(this.handleError<any>('deleteHero'))
    );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term) {
      return of<Hero[]>([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}?name=${term}`).pipe(
      tap(heroes => heroes.length
        ? this.log(`found heroes matching "${term}"`)
        : this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHero', [])));
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  /**
  * Handle Http operation that failed.
  * Let the app continue.
  * @param operation - name of the operation that failed
  * @param result - optional value to return as the observable result
  */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result);
    };
  }

}
