import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Processor} from '../dataaccess/processor';

@Injectable({
  providedIn: 'root'
})
export class ProcessorService {
  readonly backendUrl = 'processor';

  constructor(private http: HttpClient) {
  }

  public getList(): Observable<Processor[]> {
    return this.http.get<Processor[]>(environment.backendBaseUrl + `processors`);
  }

  public getOne(id: number): Observable<Processor> {
    return this.http.get<Processor>(environment.backendBaseUrl + this.backendUrl + `/${id}`);
  }

  public update(processor: Processor): Observable<Processor> {
    return this.http.put<Processor>(environment.backendBaseUrl + this.backendUrl + `/update/${processor.processorId}`, processor);
  }

  public save(processor: Processor): Observable<Processor> {
    return this.http.post<Processor>(environment.backendBaseUrl +  this.backendUrl + `/create`, processor);
  }

  public delete(id: number): Observable<HttpResponse<string>> {
    return this.http.delete<string>(environment.backendBaseUrl + this.backendUrl  + `/delete`+ `/${id}`, {observe: 'response'});
  }
}
