import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {HeaderService} from '../../service/header.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmDialogComponent} from '../../components/confirm-dialog/confirm-dialog.component';
import {Topic} from '../../dataaccess/topic';
import {TopicService} from '../../service/topic.service';
import {BaseComponent} from '../../components/base/base.component';

@Component({
  selector: 'app-topic-list',
  templateUrl: './topic-list.component.html',
  styleUrls: ['./topic-list.component.scss']
})
export class TopicListComponent extends BaseComponent implements OnInit, AfterViewInit {
  topicDataSource = new MatTableDataSource<Topic>();
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  columns = ['topicName', 'topicDescription'];

  public constructor(private topicService: TopicService, private dialog: MatDialog,
                     private headerService: HeaderService, private router: Router, private snackBar: MatSnackBar,
                     protected override translate: TranslateService) {
    super(translate);
    this.headerService.setPage('nav.topics');
  }

  async ngOnInit() {
    await this.reloadData();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.topicDataSource.paginator = this.paginator;
    }
  }

  reloadData() {
    this.topicService.getList().subscribe(obj => {
      this.topicDataSource.data = obj;
    });
  }

  async edit(e: Topic) {
    await this.router.navigate(['topic', e.topicId]);
  }

  async add() {
    await this.router.navigate(['topic']);
  }

  delete(e: Topic) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'dialogs.title_delete',
        message: 'dialogs.message_delete'
      }
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        this.topicService.delete(e.topicId).subscribe({
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
