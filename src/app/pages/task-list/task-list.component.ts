import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {HeaderService} from '../../service/header.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmDialogComponent} from '../../components/confirm-dialog/confirm-dialog.component';
import {Task} from '../../dataaccess/task';
import {BaseComponent} from '../../components/base/base.component';
import {TaskService} from '../../service/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent extends BaseComponent implements OnInit, AfterViewInit {
  taskDataSource = new MatTableDataSource<Task>();
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  columns = ['taskName','taskDescription','dueDate','processorData', 'topicData', 'tagData', 'actions'];

  public constructor(private taskService: TaskService, private dialog: MatDialog,
                     private headerService: HeaderService, private router: Router, private snackBar: MatSnackBar,
                     protected override translate: TranslateService) {
    super(translate);
    this.headerService.setPage('nav.usage');
  }

  async ngOnInit() {
    await this.reloadData();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.taskDataSource.paginator = this.paginator;
    }
  }

  reloadData() {
    this.taskService.getList().subscribe(obj => {
      this.taskDataSource.data = obj;
    });
  }

  async edit(e: Task) {
    await this.router.navigate(['task', e.taskId]);
  }

  async add() {
    await this.router.navigate(['task']);
  }

  delete(e: Task) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'dialogs.title_delete',
        message: 'dialogs.message_delete'
      }
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        this.taskService.delete(e.taskId).subscribe({
          next: response => {
            if (response.status === 204) {
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
