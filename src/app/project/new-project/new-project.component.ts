import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit {

  title = "";
  form: FormGroup;
  thumbnails$: Observable<string[]>;
  constructor(@Inject(MAT_DIALOG_DATA) private data,
    private dialogRef: MatDialogRef<NewProjectComponent>,
    private fb: FormBuilder) {
  }

  ngOnInit() {
    this.thumbnails$ = this.data.thumbnails;
    if (this.data.project) {
      this.form = this.fb.group({
        name: [this.data.project.name, Validators.required],
        desc: [this.data.project.desc],
        coverImg: [this.data.project.coverImg]
      });
      this.title = "编辑项目";
    } else {
      this.form = this.fb.group({
        name: ['', Validators.required],
        desc: [''],
        coverImg: [this.data.img]
      });
      this.title = "新建项目";
    }
  }

  onSubmit({ value, valid }, ev: Event) {
    ev.preventDefault();
    this.dialogRef.close(value);
  }

}
