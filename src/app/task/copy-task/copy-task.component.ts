import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-copy-task',
  templateUrl: './copy-task.component.html',
  styleUrls: ['./copy-task.component.scss']
})
export class CopyTaskComponent implements OnInit {

  lists = [];
  form: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) private data,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CopyTaskComponent>) { }

  ngOnInit() {
    this.lists = this.data.lists;
    this.form = this.fb.group({
      listId: ['', Validators.required]
    });
  }

  onSubmit({ value, valid }, ev: Event) {
    ev.preventDefault();
    this.dialogRef.close(value.listId);
  }
}
