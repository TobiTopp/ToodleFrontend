import {Tag} from './tag';
import {Processor} from './processor';
import {Topic} from './topic';

export class Task {
  public id!: number;
  public taskName = '';
  public taskDescription = '';
  public dueDate = new Date();
  public processor = new Processor();
  public topic = new Topic();
  public tag = new Tag();
}
