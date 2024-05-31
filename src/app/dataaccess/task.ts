import {Tag} from './tag';
import {Processor} from './processor';
import {Topic} from './topic';

export class Task {
  public taskId!: number;
  public taskName = '';
  public taskDescription = '';
  public dueDate = new Date();
  public processorData = new Processor();
  public topicData = new Topic();
  public tagData = new Tag();
}
