import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Tag} from '../dataaccess/tag';

@Injectable({
  providedIn: 'root'
})
export class TagService {


  constructor(private http: HttpClient) {
  }

  public getList(): Observable<Tag[]> {
    return this.http.get<Tag[]>(environment.backendBaseUrl + `tags`);
  }

  public getOne(id: number): Observable<Tag> {
    return this.http.get<Tag>(environment.backendBaseUrl  + `tag/${id}`);
  }

  public update(tag: Tag): Observable<Tag> {
    return this.http.put<Tag>(environment.backendBaseUrl + `tag/update/${tag.tagId}`, tag);
  }

  public save(tag: Tag): Observable<Tag> {
    return this.http.post<Tag>(environment.backendBaseUrl + `tag/create`, tag);
  }

  public delete(id: number): Observable<HttpResponse<string>> {
    return this.http.delete<string>(environment.backendBaseUrl + `tag/delete/${id}`, {observe: 'response'});
  }
}
