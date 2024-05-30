import {TestBed} from '@angular/core/testing';

import {TopicService} from './topic.service';
import {createSpyFromClass, Spy} from 'jasmine-auto-spies';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Topic} from '../dataaccess/topic';

describe('TopicService', () => {
  let service: TopicService;
  let httpSpy: Spy<HttpClient>;

  const fakeTopics: Topic[] = [
    {
      topicId: 1,
      topicName: 'Topic 2',
      topicDescription: 'Topic 2'
    },
    {
      topicId: 2,
      topicName: 'Topic 2',
      topicDescription: 'Topic 2'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: HttpClient, useValue: createSpyFromClass(HttpClient)}
      ]
    });
    service = TestBed.inject(TopicService);
    httpSpy = TestBed.inject<any>(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should return a list of topics', (done: DoneFn) => {
    httpSpy.get.and.nextWith(fakeTopics);

    service.getList().subscribe({
        next:
          topics => {
            expect(topics).toHaveSize(fakeTopics.length);
            done();
          },
        error: done.fail
      }
    );
    expect(httpSpy.get.calls.count()).toBe(1);
  });
  it('should create a new topic', (done: DoneFn) => {

    const newTopic: Topic = {
      topicId: 3,
      topicName: 'Topic 3',
      topicDescription: 'Topic 3'
    };

    httpSpy.post.and.nextWith(newTopic);

    service.save(newTopic).subscribe({
        next: topic => {
          expect(topic).toEqual(newTopic);
          done();
        },
        error: done.fail
      }
    );
    expect(httpSpy.post.calls.count()).toBe(1);
  });

  it('should update an topic', (done: DoneFn) => {

    const topic = fakeTopics[0];
    topic.topicName = 'Updated Topic';

    httpSpy.put.and.nextWith(topic);

    service.update(topic).subscribe({
      next: topic => {
        expect(topic.topicName).toEqual('Updated Topic');
        done();
      },
      error: done.fail
    });
    expect(httpSpy.put.calls.count()).toBe(1);
  });

  it('should delete an existing topic', (done: DoneFn) => {

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
