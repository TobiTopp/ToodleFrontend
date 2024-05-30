import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {HeaderService} from '../../service/header.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmDialogComponent} from '../../components/confirm-dialog/confirm-dialog.component';
import {Processor} from '../../dataaccess/processor';
import {BaseComponent} from '../../components/base/base.component';
import {ProcessorService} from '../../service/processor.service';

@Component({
  selector: 'app-processor-list',
  templateUrl: './processor-list.component.html',
  styleUrls: ['./processor-list.component.scss']
})
export class ProcessorListComponent extends BaseComponent implements OnInit, AfterViewInit {
  processorDataSource = new MatTableDataSource<Processor>();
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  columns = ['firstName', 'secondName'];

  public constructor(private processorService: ProcessorService, private dialog: MatDialog,
                     private headerService: HeaderService, private router: Router, private snackBar: MatSnackBar,
                     protected override translate: TranslateService) {
    super(translate)
    this.headerService.setPage('nav.processors');
  }

  async ngOnInit() {
    await this.reloadData();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.processorDataSource.paginator = this.paginator;
    }
  }

  reloadData() {
    this.processorService.getList().subscribe(obj => {
      this.processorDataSource.data = obj;
    });
  }

  async edit(e: Processor) {
    await this.router.navigate(['processor', e.processorId]);
  }

  async add() {
    await this.router.navigate(['processor']);
  }

  delete(e: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'dialogs.title_delete',
        message: 'dialogs.message_delete'
      }
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        this.processorService.delete(e.id).subscribe({
          next: response => {
            if (response.status === 200) {
              this.snackBar.open(this.deletedMessage, this.closeMessage, {duration: 5000});
              this.reloadData();
            } else {
              this.snackBar.open(this.deleteErrorMessage, this.closeMessage, {duration: 5000});
            }
          },
          error: () => this.snackBar.open(this.deleteErrorMessage, this.closeMessage, {duration: 5000})
        });
      }
    });
  }
}

