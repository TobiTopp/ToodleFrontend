import {TestBed} from '@angular/core/testing';
import {ProcessorService} from './processor.service';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Processor} from '../dataaccess/processor';
import {createSpyFromClass, Spy} from 'jasmine-auto-spies';


describe('ProcessorService', () => {
  let service: ProcessorService;
  let httpSpy: Spy<HttpClient>;

  const fakeProcessors: Processor[] = [
    {
      processorId: 1,
      firstName: 'Meier',
      secondName: 'Max',
    },
    {
      processorId: 2,
      firstName: 'Meyer',
      secondName: 'Tim',
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: HttpClient, useValue: createSpyFromClass(HttpClient)}
      ]
    });
    service = TestBed.inject(ProcessorService);
    httpSpy = TestBed.inject<any>(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should return a list of processors', (done: DoneFn) => {
    httpSpy.get.and.nextWith(fakeProcessors);

    service.getList().subscribe({
        next:
          processors => {
            expect(processors).toHaveSize(fakeProcessors.length);
            done();
          },
        error: done.fail
      }
    );
    expect(httpSpy.get.calls.count()).toBe(1);
  });
  it('should create a new customer', (done: DoneFn) => {

    const newProcessor: Processor = {
      processorId: 3,
      firstName: 'Müller',
      secondName: 'Maximilian',
    };

    httpSpy.post.and.nextWith(newProcessor);

    service.save(newProcessor).subscribe({
        next: processor => {
          expect(processor).toEqual(newProcessor);
          done();
        },
        error: done.fail
      }
    );
    expect(httpSpy.post.calls.count()).toBe(1);
  });

  it('should update an processor', (done: DoneFn) => {

    const processor = fakeProcessors[0];
    processor.firstName = 'Updated Processor';

    httpSpy.put.and.nextWith(processor);

    service.update(processor).subscribe({
      next: customer => {
        expect(customer.firstName).toEqual('Updated Processor');
        done();
      },
      error: done.fail
    });
    expect(httpSpy.put.calls.count()).toBe(1);
  });

  it('should delete an existing processor', (done: DoneFn) => {

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
})
