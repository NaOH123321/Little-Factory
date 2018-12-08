import { filter, map } from 'rxjs/operators';
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
import { take, withLatestFrom } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TaskList } from '../../domain';

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

  // lists = [
  //   {
  //     id: 1,
  //     name: "待办",
  //     order: 1,
  //     tasks: [{
  //       id: 1,
  //       desc: "任务一：去星巴克买咖啡",
  //       completed: true,
  //       priority: 3,
  //       owner: {
  //         id: 1,
  //         name: "张三",
  //         avatar: "avatars:svg-11"
  //       },
  //       dueDate: new Date(),
  //       reminder: new Date(),
  //     }, {
  //       id: 2,
  //       desc: "任务二：完成老师布置ppt的作业",
  //       completed: false,
  //       priority: 2,
  //       owner: {
  //         id: 2,
  //         name: "李四",
  //         avatar: "avatars:svg-13"
  //       },
  //       dueDate: new Date()
  //     }
  //     ]
  //   }, {
  //     id: 2,
  //     name: "进行中",
  //     order: 2,
  //     tasks: [{
  //       id: 1,
  //       desc: "任务三：项目代码评审",
  //       completed: false,
  //       priority: 1,
  //       owner: {
  //         id: 1,
  //         name: "张三",
  //         avatar: "avatars:svg-11"
  //       },
  //       dueDate: new Date()
  //     }, {
  //       id: 2,
  //       desc: "任务四：制定项目计划",
  //       completed: false,
  //       priority: 2,
  //       owner: {
  //         id: 3,
  //         name: "王五",
  //         avatar: "avatars:svg-15"
  //       },
  //       dueDate: new Date()
  //     }
  //     ]
  //   }
  // ];
  lists$: Observable<TaskList[]>;
  projectId$: Observable<string>;

  constructor(private dialog: MatDialog, private store$: Store<fromRoot.State>, private route: ActivatedRoute) { }

  ngOnInit() {
    this.projectId$ = this.route.paramMap.pipe(map(p => p.get("id")));
    this.lists$ = this.store$.pipe(select(fromRoot.getTaskListByProject));
  }

  launchNewTaskDialog() {
    const dialogRef = this.dialog.open(NewTaskComponent, { data: { title: "新建任务" } });
  }

  launchUpdateTaskDialog(task) {
    const dialogRef = this.dialog.open(NewTaskComponent, { data: { title: "修改任务", task: task } });
  }

  launchCopyTaskDialog() {
    const dialogRef = this.dialog.open(CopyTaskComponent, { data: { lists: this.lists$ } });
  }

  launchEditListDialog(list: TaskList) {
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

  launchDelListDialog(list: TaskList) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent,
      { data: { title: "删除任务列表", content: "您确定删除该任务列表吗？" } });
    dialogRef.afterClosed().pipe(take(1)).
      subscribe(val => {
        if (val)
          return this.store$.dispatch(new taskListActions.TaskListDeleteAction(list));
      });
  }

  handleMove(srcData, list) {
    switch (srcData.tag) {
      case "task-item":
        console.log("handle item");
        break;
      case "task-list":
        console.log("handle list");
        const srclist = srcData.data;
        const tempOrder = srclist.order;
        srclist.order = list.order;
        list.order = tempOrder;
        break;
      default:
        break;
    }
  }

  handleQuickTask(desc: string) {
    console.log(desc);
  }
}
