import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Topic} from '../dataaccess/topic';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  readonly backendUrl = 'topic';

  constructor(private http: HttpClient) {
  }

  public getList(): Observable<Topic[]> {
    return this.http.get<Topic[]>(environment.backendBaseUrl + `topics`);
  }

  public getOne(id: number): Observable<Topic> {
    return this.http.get<Topic>(environment.backendBaseUrl + this.backendUrl + `/${id}`);
  }

  public update(topic: Topic): Observable<Topic> {
    return this.http.put<Topic>(environment.backendBaseUrl + this.backendUrl + `/update/${topic.topicId}`, topic);
  }

  public save(topic: Topic): Observable<Topic> {
    return this.http.post<Topic>(environment.backendBaseUrl + this.backendUrl + `/create`, topic);
  }

  public delete(id: number): Observable<HttpResponse<string>> {
    return this.http.delete<string>(environment.backendBaseUrl + this.backendUrl + `/delete/${id}`, {observe: 'response'});
  }
}
