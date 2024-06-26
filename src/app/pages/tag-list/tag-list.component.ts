import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Tag} from '../../dataaccess/tag';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {HeaderService} from '../../service/header.service';
import {Router} from '@angular/router';
import {ConfirmDialogComponent} from '../../components/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {BaseComponent} from '../../components/base/base.component';
import {TagService} from '../../service/tag.service';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss']
})
export class TagListComponent extends BaseComponent implements OnInit, AfterViewInit {
  tagDataSource = new MatTableDataSource<Tag>();
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  columns = ['tagName', 'tagDescription', 'actions'];

  public constructor(private tagService: TagService, private dialog: MatDialog,
                     private headerService: HeaderService, private router: Router, private snackBar: MatSnackBar,
                     protected override translate: TranslateService) {
    super(translate);
    this.headerService.setPage('nav.tags');
  }

  async ngOnInit() {
    await this.reloadData();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.tagDataSource.paginator = this.paginator;
    }
  }

  reloadData() {
    this.tagService.getList().subscribe(obj => {
      this.tagDataSource.data = obj;
    });
  }

  async edit(e: Tag) {
    await this.router.navigate(['tag', e.tagId]);
  }

  async add() {
    await this.router.navigate(['tag']);
  }

  delete(e: Tag) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'dialogs.title_delete',
        message: 'dialogs.message_delete'
      }
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        this.tagService.delete(e.tagId).subscribe({
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
