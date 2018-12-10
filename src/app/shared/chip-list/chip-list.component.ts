import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { User } from './../../domain';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, map, startWith } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import * as fromRoot from '../../reducers';
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-chip-list',
  templateUrl: './chip-list.component.html',
  styleUrls: ['./chip-list.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ChipListComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => ChipListComponent), multi: true }
  ]
})
export class ChipListComponent implements OnInit, ControlValueAccessor {

  @Input()
  multiple = true;
  @Input()
  label = "添加/修改成员";
  @Input()
  placeHolderText = "请输入成员 email";
  @Input()
  removable = true;

  allMembers: User[] = [];

  members: User[] = [];
  memberResult$: Observable<User[]>;
  form: FormGroup;

  constructor(private fb: FormBuilder, private service$: UserService, private store$: Store<fromRoot.State>) { }

  private propagateChange = (_: any) => { };

  ngOnInit() {
    this.form = this.fb.group({
      memberSearch: ['']
    });
    this.store$.pipe(select(fromRoot.getUserAll)).subscribe(
      users => this.allMembers = [...users]
    );

    this.memberResult$ = this.form.get("memberSearch").valueChanges.pipe(
      startWith(null),
      // debounceTime(300),
      // distinctUntilChanged(),
      // filter(n => n && n.length > 1),
      map((val: string | null) => val ? this._filter(val) : this.allMembers.slice()),
      // switchMap(val => this.service$.search(val))
    );
  }

  writeValue(obj: User[]): void {
    if (obj && this.multiple) {
      const userEntities = obj.reduce((a, x) => ({ ...a, x }), {});
      if (this.members) {
        const remaining = this.members.filter(item => !userEntities[item.id]);
        this.members = [...remaining, ...obj];
      }
    } else if (obj && !this.multiple) {
      this.members = [...obj];
    }
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void { }

  validate(c: FormControl): { [key: string]: any } {
    return this.multiple || this.members.length !== 0 ? null : {
      ChipListInvalid: true
    };
  }

  remove(member: User) {
    const ids = this.members.map(m => m.id);
    const index = ids.indexOf(member.id);
    if (this.multiple) {
      this.members.splice(index, 1);
    } else {
      this.members = [];
    }
    this.form.patchValue({ memberSearch: "" });
    this.propagateChange(this.members);
  }

  handleMemberSelection(member: User) {
    if (this.members.map(m => m.id).indexOf(member.id) !== -1) {
      this.form.patchValue({ memberSearch: "" });
      return;
    }
    this.members = this.multiple ? [...this.members, member] : [member];
    // this.form.patchValue({ memberSearch: member.name });
    this.form.patchValue({ memberSearch: "" });
    this.propagateChange(this.members);
  }

  // displayUser(user: User) {
  //   return user ? user.name : "";
  // }

  get displayInput() {
    return this.multiple || this.members.length === 0;
  }

  private _filter(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.allMembers.filter(user => user.email.indexOf(filterValue) === 0);
  }
}
