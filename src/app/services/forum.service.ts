import { HttpClient, HttpErrorResponse, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { CreateForumReq } from '../models/create-forum-req';
import { ForumPost } from '../models/forum-post';
import { SessionService } from './session.service';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  baseUrl: string = "/api/ForumPosts";

  constructor(private httpClient: HttpClient, private sessionService: SessionService) { 

  }

  getForumPosts():Observable<ForumPost[]> {
    return this.httpClient.get<ForumPost[]>(this.baseUrl + "/retrieveAllForumPosts").pipe(
      catchError(this.handleError)
    );
    
  }

  createNewForum(newForum: ForumPost): Observable<number> {
    let createNewForumReq: CreateForumReq = new CreateForumReq(this.sessionService.getUsername(), this.sessionService.getPassword(), newForum);

    return this.httpClient.put<number>(this.baseUrl, createNewForumReq, httpOptions).pipe (
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage: string = "";
    if(error.error instanceof ErrorEvent) {
      errorMessage = "An unknown error has occured: " + error.error;

    } else {
      errorMessage = "A HTTP error has occured: " + `HTTP${error.status}: ${error.error}`;
    }
    console.error(errorMessage);

    return throwError(() => new Error(errorMessage));
  }
}