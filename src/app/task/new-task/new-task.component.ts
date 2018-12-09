import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskVM } from '../../vm/task.vm';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  title = "";
  priorities = [
    {
      value: 1,
      label: "紧急"
    },
    {
      value: 2,
      label: "重要"
    },
    {
      value: 3,
      label: "普通"
    }
  ];
  form: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) private data,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewTaskComponent>) { }

  ngOnInit() {
    this.title = this.data.title;
    const task: TaskVM = this.data.task;
    if (task) {
      this.form = this.fb.group({
        desc: [task.desc, Validators.required],
        priority: [task.priority, Validators.required],
        dueDate: [task.dueDate],
        reminder: [task.reminder],
        owner: [[task.owner], Validators.required],
        participants: [task.participants],
        remark: [task.remark]
      });
    } else {
      this.form = this.fb.group({
        desc: ['', Validators.required],
        priority: [3, Validators.required],
        dueDate: [''],
        reminder: [''],
        owner: [[this.data.owner], Validators.required],
        participants: [''],
        remark: ['']
      });
    }
  }

  onSubmit({ value, valid }, ev: Event) {
    ev.preventDefault();
    this.dialogRef.close({
      ...value,
      ownerId: value.owner[0].id,
      participantIds: value.participants ? value.participants.map(participant => participant.id) : []
    });
  }
}
