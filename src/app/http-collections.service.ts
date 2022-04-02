import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpCollectionsService {
  constructor(private http: HttpClient) { }
  url = '';//http://localhost:8080 for development
  getCollection(collection:string, from:string):Observable<[]>{
    return this.http.get<[]>(`${this.url}/${collection}/${from}`)
  }
}