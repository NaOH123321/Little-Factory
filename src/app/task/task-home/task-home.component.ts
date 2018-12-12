import { filter, map, switchMap } from 'rxjs/operators';
import { Component, OnInit, HostBinding } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NewTaskComponent } from '../new-task/new-task.component';
import { CopyTaskComponent } from '../copy-task/copy-task.component';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { NewTaskListComponent } from '../new-task-list/new-task-list.component';
import { slideToRight } from './../../anim/router.anim';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import * as taskListActions from './../../actions/task-list.action';
import * as taskActions from './../../actions/task.action';
import { take, withLatestFrom } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TaskList, Task } from '../../domain';
import { TaskListVM } from 'src/app/vm/task-list.vm';
import { TaskVM } from 'src/app/vm/task.vm';

@Component({
  selector: 'app-task-home',
  templateUrl: './task-home.component.html',
  styleUrls: ['./task-home.component.scss'],
  animations: [
    slideToRight
  ]
})
export class TaskHomeComponent implements OnInit {

  @HostBinding("@routeAnim") routeAnim;

  lists$: Observable<TaskListVM[]>;
  projectId$: Observable<string>;

  constructor(private dialog: MatDialog, private store$: Store<fromRoot.State>, private route: ActivatedRoute) { }

  ngOnInit() {
    this.projectId$ = this.route.paramMap.pipe(map(p => p.get("id")));
    this.lists$ = this.store$.pipe(select(fromRoot.getTaskListsByProject));
  }

  launchNewTaskDialog(list: TaskListVM) {
    const user$ = this.store$.pipe(select(fromRoot.getAuthUser));
    user$.pipe(
      take(1),
      map(user => this.dialog.open(NewTaskComponent, { data: { title: "新建任务", owner: user } })),
      switchMap(dialogRef => dialogRef.afterClosed().pipe(take(1)))
    ).subscribe(val => {
      if (val) {
        this.store$.dispatch(new taskActions.TaskAddAction({
          ...val,
          taskListId: list.id,
          completed: false,
          createDate: new Date()
        }));
      }
    });
  }

  launchUpdateTaskDialog(task: TaskVM) {
    const dialogRef = this.dialog.open(NewTaskComponent, { data: { title: "修改任务", task: task } });
    dialogRef.afterClosed().pipe(take(1)).
      subscribe(val => {
        if (val) {
          this.store$.dispatch(new taskActions.TaskUpdateAction({ ...task, ...val }));
        }
      });
  }

  launchCopyTaskDialog(list: TaskListVM) {
    this.lists$.pipe(
      take(1),
      map(l => l.filter(n => n.id !== list.id)),
      map(li => this.dialog.open(CopyTaskComponent, { data: { lists: li } })),
      switchMap(dialogRef => dialogRef.afterClosed().pipe(take(1)))
    ).subscribe(val => {
      if (val)
        this.store$.dispatch(new taskActions.TaskMoveAllAction({ srcListId: list.id, targetListId: val }));
    });
  }

  launchEditListDialog(list: TaskListVM) {
    const dialogRef = this.dialog.open(NewTaskListComponent,
      { data: { title: "更改列表名称", tasklist: list } });
    dialogRef.afterClosed().pipe(take(1)).
      subscribe(name => {
        if (name) {
          return this.store$.dispatch(new taskListActions.TaskListUpdateAction({ ...list, name: name }));
        }
      });
  }

  launchNewListDialog() {
    const dialogRef = this.dialog.open(NewTaskListComponent,
      { data: { title: "新建列表" } });
    dialogRef.afterClosed().pipe(
      take(1),
      filter(n => n),
      withLatestFrom(this.projectId$, (name, projectId) => ({ name, projectId })),
      withLatestFrom(this.store$.pipe(select(fromRoot.getTaskListTotal)), (val, order) => ({ ...val, order }))
    ).
      subscribe(val => {
        const taskList: TaskList = { projectId: val.projectId, order: val.order + 1, name: val.name };
        return this.store$.dispatch(new taskListActions.TaskListAddAction(taskList));
      });
  }

  launchDelListDialog(list: TaskListVM) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent,
      { data: { title: "删除任务列表", content: "您确定删除该任务列表吗？" } });
    dialogRef.afterClosed().pipe(take(1)).
      subscribe(val => {
        if (val)
          return this.store$.dispatch(new taskListActions.TaskListDeleteAction(list));
      });
  }

  handleMove(srcData, list: TaskListVM) {
    switch (srcData.tag) {
      case "task-item":
        this.store$.dispatch(new taskActions.TaskMoveAction({ taskId: srcData.data.id, taskListId: list.id }));
        break;
      case "task-list":
        this.store$.dispatch(new taskListActions.TaskListSwapAction({ src: srcData.data, target: list }));
        break;
      default:
        break;
    }
  }

  handleQuickTask(desc: string, list: TaskListVM) {
    const user$ = this.store$.pipe(
      select(fromRoot.getAuth),
      map(auth => auth.userId)
    );
    user$.pipe(take(1)).subscribe(userId =>
      this.store$.dispatch(new taskActions.TaskAddAction({
        desc: desc,
        priority: 3,
        ownerId: userId,
        taskListId: list.id,
        completed: false,
        participantIds: [],
        createDate: new Date()
      }))
    );
  }
}
