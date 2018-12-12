import { Component, OnInit, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NewProjectComponent } from '../new-project/new-project.component';
import { InviteComponent } from '../invite/invite.component';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { slideToRight } from './../../anim/router.anim';
import { range, Observable } from 'rxjs';
import { map, reduce, switchMap, take } from 'rxjs/operators';
import { Project, User } from '../../domain';
import * as fromRoot from '../../reducers';
import * as projectActions from './../../actions/project.action';
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  animations: [
    slideToRight
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent implements OnInit {

  @HostBinding("@routeAnim") routeAnim;

  projects$: Observable<Project[]>;
  constructor(private dialog: MatDialog, private cd: ChangeDetectorRef, private store$: Store<fromRoot.State>) { }

  ngOnInit() {
    this.store$.dispatch(new projectActions.ProjectLoadAction(null));
    this.projects$ = this.store$.pipe(select(fromRoot.getProjectAll));
  }

  openNewProjectDialog() {
    const img = `assets/img/covers/${Math.floor(Math.random() * 40)}_tn.jpg`;
    const dialogRef = this.dialog.open(NewProjectComponent,
      { data: { thumbnails: this.getThumbnails(), img: img } });
    dialogRef.afterClosed().pipe(take(1)).
      subscribe(val => {
        if (val) {
          const project = { ...val, coverImg: this.buildImgSrc(val.coverImg) };
          this.store$.dispatch(new projectActions.ProjectAddAction(project));
        }
      });
  }

  launchInviteDialog(project: Project) {
    this.store$.pipe(
      select(fromRoot.getProjectMembers(project.id)),
      take(1),
      map(users => this.dialog.open(InviteComponent, { data: { members: users } })),
      switchMap(dialogRef => dialogRef.afterClosed().pipe(take(1)))
    ).
      subscribe(val => {
        if (val) {
          this.store$.dispatch(new projectActions.ProjectInviteAction({ projectId: project.id, members: <User[]>val }));
        }
      });
  }

  launchUpdateDialog(project: Project) {
    const dialogRef = this.dialog.open(NewProjectComponent,
      { data: { thumbnails: this.getThumbnails(), project: project } });
    dialogRef.afterClosed().pipe(take(1)).
      subscribe(val => {
        if (val) {
          const pjr = { ...val, id: project.id, coverImg: this.buildImgSrc(val.coverImg) };
          this.store$.dispatch(new projectActions.ProjectUpdateAction(pjr));
        }
      });
  }

  launchDelDialog(project: Project) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent,
      { data: { title: "删除项目", content: "您确定删除该项目吗？" } });
    dialogRef.afterClosed().pipe(take(1)).
      subscribe(val => {
        if (val)
          this.store$.dispatch(new projectActions.ProjectDeleteAction(project));
      });
  }

  selectProject(project: Project) {
    this.store$.dispatch(new projectActions.ProjectSelectAction(project));
  }

  private getThumbnails(): Observable<string[]> {
    return range(0, 40).pipe(
      map(i => `assets/img/covers/${i}_tn.jpg`),
      reduce((acc: string[], x: string) => [...acc, x], [])
    );
  }

  private buildImgSrc(img: string): string {
    return img.indexOf('_') > -1 ? img.split('_')[0] + '.jpg' : img;
  }
}
