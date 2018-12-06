import { Component, OnInit, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NewProjectComponent } from '../new-project/new-project.component';
import { InviteComponent } from '../invite/invite.component';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { slideToRight } from './../../anim/router.anim';
import { ProjectService } from './../../services/project.service';
import { range, Observable, Subscription } from 'rxjs';
import { map, reduce, switchMap, take } from 'rxjs/operators';
import { filter } from 'rxjs/operators';
import { Project } from '../../domain';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  animations: [
    slideToRight
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent implements OnInit, OnDestroy {

  @HostBinding("@routeAnim") routeAnim;

  projects: Project[] = [];
  sub: Subscription;
  constructor(private dialog: MatDialog, private cd: ChangeDetectorRef, private service$: ProjectService) { }

  ngOnInit() {
    this.sub = this.service$.get("1").subscribe(
      projects => {
        this.projects = projects;
        this.cd.markForCheck();
      });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  openNewProjectDialog() {
    const img = `assets/img/covers/${Math.ceil(Math.random() * 40)}_tn.jpg`;
    const dialogRef = this.dialog.open(NewProjectComponent,
      { data: { thumbnails: this.getThumbnails(), img: img } });
    dialogRef.afterClosed().pipe(
      take(1),
      filter(n => n),
      map(val => ({ ...val, coverImg: this.buildImgSrc(val.coverImg) })),
      switchMap(project => this.service$.add(project))
    ).
      subscribe(project => {
        this.projects = [...this.projects, project];
        this.cd.markForCheck();
      });
  }

  launchInviteDialog() {
    const dialogRef = this.dialog.open(InviteComponent, { data: { members: [] } });
  }

  launchUpdateDialog(project: Project) {
    const dialogRef = this.dialog.open(NewProjectComponent,
      { data: { thumbnails: this.getThumbnails(), project: project } });
    dialogRef.afterClosed().pipe(
      take(1),
      filter(n => n),
      map(val => ({ ...val, id: project.id, coverImg: this.buildImgSrc(val.coverImg) })),
      switchMap(project => this.service$.update(project))
    ).
      subscribe(project => {
        const index = this.projects.map(p => p.id).indexOf(project.id);
        this.projects = [...this.projects.slice(0, index), project, ...this.projects.slice(index + 1)];
        this.cd.markForCheck();
      });
  }

  launchConfirmDialog(project: Project) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { title: "删除项目", content: "您确定删除该项目吗？" } });
    dialogRef.afterClosed().pipe(
      take(1),
      filter(n => n),
      switchMap(_ => this.service$.del(project))
    ).
      subscribe(_ => {
        console.log(_);
        this.projects = this.projects.filter(p => p.id !== project.id);
        this.cd.markForCheck();
      });
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
