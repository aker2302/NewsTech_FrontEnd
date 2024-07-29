import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, interval, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface Article {
  id: string;
  title: string;
  link: string;
  keywords: string[];
  description: string;
  pubDate: string;
  image_url: string;
  source_id: string;
  source_url: string;
  source_icon: string;
  source_priority: string;
  country: string[];
  category: string[];
  language: string;
}

export interface ApiResponse {
  status: string;
  totalArticles: number;
  articles: Article[];
  totalPages: number;
  currentPage:number;
}

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private apiUrlNewsLetter = 'http://localhost:8090/api/v1/public/subscribe';
  private getArticlesApiUrl = 'http://localhost:8090/api/v1/public/getarticles';

  private apiUrlNewsLetterPROD = 'https://technews-production.up.railway.app/api/v1/proxy/public/subscribe';
  private getArticlesApiUrlPROD = 'https://technews-production.up.railway.app/api/v1/proxy/public/getarticles';

  constructor(private http: HttpClient) { }

  private getHeaders(){
    return new HttpHeaders({
    })
  }

  getArticles(size: number = 10, page: number = 0): Observable<any> {
    return this.http.get<any>(`${this.getArticlesApiUrlPROD}?keywords=&size=${size}&page=${page}`).pipe(
      tap(response => console.log('Fetched articles:', response)), 
      catchError(error => {
        console.error('Error fetching articles:', error);
        return throwError(error);
      })
    );
  }

  searchArticles(keywords: string[],size: number = 10, page: number = 0): Observable<any> {
    return this.http.get<any>(`${this.getArticlesApiUrlPROD}?keywords=${keywords}&page=${page}&size=${size}`).pipe(
      tap(response => console.log('Fetched articles:', response)), 
      catchError(error => {
        console.error('Error fetching articles:', error);
        return throwError(error);
      })
    );
  }

  subscribeToNewsletter(name: string, email: string): Observable<any> {
    const subscriptionData = { name, email };
    return this.http.post<any>(`${this.apiUrlNewsLetterPROD}`, subscriptionData).pipe(
      tap(response => console.log('User added to the NewLetter:', response)), 
      catchError(error => {
        console.error('Error adding user:', error);
        return throwError(() => new Error(error));
      })
    );
  }

}
