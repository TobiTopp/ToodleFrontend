import {Component, OnInit} from '@angular/core';
import {Tag} from '../../dataaccess/tag';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {HeaderService} from '../../service/header.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {Task} from '../../dataaccess/task';
import {Processor} from '../../dataaccess/processor';
import {BaseComponent} from '../../components/base/base.component';
import {TaskService} from '../../service/task.service';
import {TagService} from '../../service/tag.service';
import {ProcessorService} from '../../service/processor.service';
import { Topic } from 'src/app/dataaccess/topic';
import { TopicService } from 'src/app/service/topic.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent extends BaseComponent implements OnInit {

  task = new Task();
  processors: Processor[] = [];
  topics: Topic[] = [];
  tags: Tag[] = [];

  public objForm = new UntypedFormGroup({
    taskName: new UntypedFormControl(''),
    taskDescription: new UntypedFormControl(''),
    dueDate: new UntypedFormControl(''),
    processorId: new UntypedFormControl(''), 
    topicId: new UntypedFormControl(''),
    tagId: new UntypedFormControl('')
  });


  constructor(private router: Router, private headerService: HeaderService, private route: ActivatedRoute,
              private taskService: TaskService, private tagService: TagService,
              private topicService: TopicService,
              private snackBar: MatSnackBar, private processorService: ProcessorService,
              protected override translate: TranslateService, private fb: UntypedFormBuilder) {
    super(translate);
  }

  ngOnInit(): void {

    if (this.route.snapshot.paramMap.get('id') !== null) {
      const id = Number.parseInt(this.route.snapshot.paramMap.get('id') as string);
      this.taskService.getOne(id).subscribe(obj => {
        this.task = obj;
        this.headerService.setPage('nav.task_edit');
        this.objForm = this.fb.group(obj);
        this.objForm.addControl('tagId', new UntypedFormControl(obj.tagData.tagId));
        this.objForm.addControl('topicId', new UntypedFormControl(obj.topicData.topicId));
        this.objForm.addControl('processorId', new UntypedFormControl(obj.processorData.processorId));
      });
    } else {
      this.headerService.setPage('nav.task_new');
    }

    this.tagService.getList().subscribe(obj => {
      this.tags = obj;
    });
    this.topicService.getList().subscribe(obj => {
      this.topics = obj;
    });
    this.processorService.getList().subscribe(obj => {
      this.processors = obj;
    });
  }

  async back() {
    await this.router.navigate(['tasks']);
  }

  async save(formData: any) {
    this.task = Object.assign(formData);

    this.task.tagData = this.tags.find(o => o.tagId === formData.tagId) as Tag;
    this.task.topicData = this.topics.find(o => o.topicId === formData.topicId) as Topic;
    this.task.processorData = this.processors.find(o => o.processorId === formData.processorId) as Processor;

    if (this.task.taskId) {
      this.taskService.update(this.task).subscribe({
        next: () => {
          this.snackBar.open(this.messageSaved, this.messageClose, {duration: 5000});
          this.back();
        },
        error: () => {
          this.snackBar.open(this.messageError, this.messageClose, {duration: 5000, politeness: 'assertive'});
        }
      });
    } else {
      this.taskService.save(this.task).subscribe({
        next: () => {
          this.snackBar.open(this.messageNewSaved, this.messageClose, {duration: 5000});
          this.back();
        },
        error: () => {
          this.snackBar.open(this.messageNewError, this.messageClose, {duration: 5000, politeness: 'assertive'});
        }
      });
    }
  }

}
