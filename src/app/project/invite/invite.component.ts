import { Component, OnInit, Output, Inject } from '@angular/core';
import { User } from '../../domain';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit {

  members: User[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) private data, private dialogRef: MatDialogRef<InviteComponent>) { }

  ngOnInit() {
    this.members = [...this.data.members];
  }

  onSubmit({ value, valid }, ev: Event) {
    ev.preventDefault();
    this.dialogRef.close(this.members);
    console.log(this.members);
  }
}
