import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {HeaderService} from '../../service/header.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {Processor} from '../../dataaccess/processor';
import {BaseComponent} from '../../components/base/base.component';
import {ProcessorService} from '../../service/processor.service';


@Component({
  selector: 'app-processor-detail',
  templateUrl: './processor-detail.component.html',
  styleUrls: ['./processor-detail.component.scss']
})
export class ProcessorDetailComponent extends BaseComponent implements OnInit {

  processor = new Processor();

  public objForm = new UntypedFormGroup({
    processorId: new UntypedFormControl(''),
    firstName: new UntypedFormControl(''),
    secondName: new UntypedFormControl('')
  });

  constructor(private router: Router, private headerService: HeaderService, private route: ActivatedRoute,
              private processorService: ProcessorService, private snackBar: MatSnackBar,
              protected override translate: TranslateService, private formBuilder: UntypedFormBuilder
             ) {
    super(translate);
  }

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('id') !== null) {
      const id = Number.parseInt(this.route.snapshot.paramMap.get('id') as string);
      this.processorService.getOne(id).subscribe(obj => {
        this.processor = obj;
        this.headerService.setPage('nav.processor_edit');
        this.objForm = this.formBuilder.group(obj);
      });
    } else {
      this.headerService.setPage('nav.processor_new');
    }
    
  }

  async back() {
    await this.router.navigate(['processors']);
  }

  async save(formData: any) {
    this.processor = Object.assign(formData);
    if (this.processor.processorId) {
      this.processorService.update(this.processor).subscribe({
        next: () => {
          this.snackBar.open(this.messageSaved, this.messageClose, {duration: 5000});
          this.back();
        },
        error: () => {
          this.snackBar.open(this.messageError, this.messageClose, {duration: 5000, politeness: 'assertive'});
        }
      });
    } else {
      this.processorService.save(this.processor).subscribe({
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
