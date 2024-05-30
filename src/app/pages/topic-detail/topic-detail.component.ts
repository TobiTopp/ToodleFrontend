import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {HeaderService} from '../../service/header.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {Topic} from '../../dataaccess/topic';
import {TopicService} from '../../service/topic.service';
import {BaseComponent} from '../../components/base/base.component';

@Component({
  selector: 'app-topic-detail',
  templateUrl: './topic-detail.component.html',
  styleUrls: ['./topic-detail.component.scss']
})
export class TopicDetailComponent extends BaseComponent implements OnInit {

  topic = new Topic();
  public objForm = new UntypedFormGroup({
    topicId: new UntypedFormControl(''),
    topicName: new UntypedFormControl(''),
    topicDescription: new UntypedFormControl('')
  });

  constructor(private router: Router, private headerService: HeaderService, private route: ActivatedRoute,
              private snackBar: MatSnackBar, protected override translate: TranslateService, private formBuilder: UntypedFormBuilder,
              private topicService: TopicService) {
    super(translate);
  }

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('id') !== null) {
      const id = Number.parseInt(this.route.snapshot.paramMap.get('id') as string);

      this.topicService.getOne(id).subscribe(obj => {
        this.topic = obj;
        this.headerService.setPage('nav.tag_edit');
        this.objForm = this.formBuilder.group(obj);
      });
    } else {
      this.headerService.setPage('nav.tag_new');
      this.objForm = this.formBuilder.group(this.topic);
    }
  }

  async back() {
    await this.router.navigate(['topics']);
  }

  async save(formData: any) {
    this.topic = Object.assign(formData);

    if (this.topic.topicId) {
      this.topicService.update(this.topic).subscribe({
        next: () => {
          this.snackBar.open(this.messageSaved, this.messageClose, {duration: 5000});
          this.back();
        },
        error: () => {
          this.snackBar.open(this.messageError, this.messageClose, {duration: 5000, politeness: 'assertive'});
        }
      });
    } else {
      this.topicService.save(this.topic).subscribe({
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
