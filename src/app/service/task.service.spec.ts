import {TestBed} from '@angular/core/testing';

import {TaskService} from './task.service';
import {createSpyFromClass, Spy} from 'jasmine-auto-spies';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Task} from '../dataaccess/task';
import {Tag} from '../dataaccess/tag';
import {Processor} from '../dataaccess/processor';

describe('TaskService', () => {
  let service: TaskService;
  let httpSpy: Spy<HttpClient>;

  const fakeTasks: Task[] = [
    {
      id: 1,
      tag: new Tag(),
      processor: new Processor(),
      fromDate: new Date(),
      toDate: new Date(),
      fromLocation: 'Basel',
      toLocation: 'Bellinzona',
      text: 'Work transfer',
      km: 270
    },
    {
      id: 2,
      tag: new Tag(),
      processor: new Processor(),
      fromDate: new Date(),
      toDate: new Date(),
      fromLocation: 'Basel',
      toLocation: 'Lugano',
      text: 'Work transfer',
      km: 300
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: HttpClient, useValue: createSpyFromClass(HttpClient)}
      ]
    });
    service = TestBed.inject(TaskService);
    httpSpy = TestBed.inject<any>(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should return a list of tags usages', (done: DoneFn) => {
    httpSpy.get.and.nextWith(fakeTasks);

    service.getList().subscribe({
        next:
          tasks => {
            expect(tasks).toHaveSize(fakeTasks.length);
            done();
          },
        error: done.fail
      }
    );
    expect(httpSpy.get.calls.count()).toBe(1);
  });
  it('should create a new tag usage', (done: DoneFn) => {

    const newTask: Task = {
      id: 3,
      tag: new Tag(),
      processor: new Processor(),
      fromDate: new Date(),
      toDate: new Date(),
      fromLocation: 'Basel',
      toLocation: 'Chiasso',
      text: 'Work transfer',
      km: 340
    };

    httpSpy.post.and.nextWith(newTask);

    service.save(newTask).subscribe({
        next: task => {
          expect(task).toEqual(newTask);
          done();
        },
        error: done.fail
      }
    );
    expect(httpSpy.post.calls.count()).toBe(1);
  });

  it('should update an tag usage', (done: DoneFn) => {

    const task = fakeTasks[0];
    task.text = 'Updated Tag Usage';

    httpSpy.put.and.nextWith(task);

    service.update(task).subscribe({
      next: task => {
        expect(task.text).toEqual('Updated Tag Usage');
        done();
      },
      error: done.fail
    });
    expect(httpSpy.put.calls.count()).toBe(1);
  });

  it('should delete an existing tag usage', (done: DoneFn) => {

    httpSpy.delete.and.nextWith(new HttpResponse({
      status: 200
    }));

    service.delete(1).subscribe({
      next: response => {
        expect(response.status).toBe(200);
        done();
      },
      error: done.fail
    });
    expect(httpSpy.delete.calls.count()).toBe(1);
  });
});
