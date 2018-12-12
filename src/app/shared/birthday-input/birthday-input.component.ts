import { Component, OnInit, forwardRef, Input, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { map, filter, startWith, debounceTime, distinctUntilChanged } from "rxjs/operators";
import { combineLatest, merge, Subscription } from 'rxjs';
import { parse, isBefore, subDays, subMonths, subYears, differenceInDays, differenceInYears, differenceInMonths } from 'date-fns';
import { isValidDate, convertToDate } from '../../utils/date.util';

export interface Age {
  age: number;
  unit: AgeUnit;
}

export enum AgeUnit {
  Year = 0,
  Month,
  Day
}

@Component({
  selector: 'app-birthday-input',
  templateUrl: './birthday-input.component.html',
  styleUrls: ['./birthday-input.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => BirthdayInputComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => BirthdayInputComponent), multi: true }
  ]
})
export class BirthdayInputComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input()
  daysTop = 90;
  @Input()
  daysBottom = 0;
  @Input()
  monthsTop = 24;
  @Input()
  monthsBottom = 1;
  @Input()
  yearsTop = 150;
  @Input()
  yearsBottom = 1;
  @Input()
  debounceTime = 300;

  form: FormGroup;
  units = [
    { value: AgeUnit.Year, label: "岁" },
    { value: AgeUnit.Month, label: "月" },
    { value: AgeUnit.Day, label: "天" }
  ];
  private propagateChange = (_: any) => { };
  private subBirth: Subscription;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    const initDate = convertToDate(subYears(Date.now(), 20));
    const initAge = this.toAge(initDate);
    this.form = this.fb.group({
      birthday: [initDate, this.validateDate],
      age: this.fb.group({
        ageNum: [initAge.age],
        ageUnit: [initAge.unit]
      }, { validator: this.validateAge("ageNum", "ageUnit") })
    });

    const birthday = this.form.get("birthday");
    const age = this.form.get("age");
    const ageNum = age.get("ageNum");
    const ageUnit = age.get("ageUnit");

    const birthday$ = birthday.valueChanges.pipe(
      map(d => ({ date: d, from: "birthday" })),
      debounceTime(this.debounceTime),
      distinctUntilChanged(),
      filter(_ => birthday.valid)
    );
    const ageNum$ = ageNum.valueChanges.pipe(
      startWith(ageNum.value),
      debounceTime(this.debounceTime),
      distinctUntilChanged(),
    );
    const ageUnit$ = ageUnit.valueChanges.pipe(
      startWith(ageUnit.value),
      debounceTime(this.debounceTime),
      distinctUntilChanged()
    );
    const age$ = combineLatest(ageNum$, ageUnit$, (_n, _u) =>
      this.toDate({ age: _n, unit: _u })
    ).pipe(
      map(d => ({ date: d, from: "age" })),
      filter(_ => age.valid)
    );
    const merged$ = merge(birthday$, age$).pipe(filter(_ => this.form.valid));
    this.subBirth = merged$.subscribe(d => {
      const aged = this.toAge(d.date);
      if (d.from === "birthday") {
        if (aged.age === ageNum.value && aged.unit === ageUnit.value) {
          return;
        }
        ageNum.patchValue(aged.age);
        ageUnit.patchValue(aged.unit);
        this.propagateChange(d.date);
      } else {
        const ageToCompare = this.toAge(birthday.value);
        if (ageToCompare.age !== aged.age || ageToCompare.unit !== aged.unit) {
          birthday.patchValue(parse(d.date));
          this.propagateChange(d.date);
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.subBirth) {
      this.subBirth.unsubscribe();
    }
  }

  writeValue(obj: any): void {
    if (obj) {
      const date = parse(convertToDate(obj));
      this.form.get('birthday').patchValue(date);
    }
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
  }

  validate(c: FormControl): { [key: string]: any } {
    const val = c.value;
    if (!val)
      return null;
    if (isValidDate(val))
      return null;
    return { birthdayInvalid: true };
  }

  validateDate(c: FormControl): { [key: string]: any } {
    const val = c.value;
    return isValidDate(val) ? null : {
      dateOfBirthInvalid: true
    };
  }

  validateAge(ageNumKey: string, ageUnitKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
      const ageNum = group.controls[ageNumKey];
      const ageUnit = group.controls[ageUnitKey];
      let result = false;
      const ageNumVal = ageNum.value;
      switch (ageUnit.value) {
        case AgeUnit.Year:
          result = ageNumVal >= this.yearsBottom && ageNumVal <= this.yearsTop;
          break;
        case AgeUnit.Month:
          result = ageNumVal >= this.monthsBottom && ageNumVal <= this.monthsTop;
          break;
        case AgeUnit.Day:
          result = ageNumVal >= this.daysBottom && ageNumVal <= this.daysTop;
          break;
        default:
          break;
      }
      return result ? null : { ageInvalid: true };
    };
  }

  toDate(age: Age): string {
    const now = new Date();
    switch (age.unit) {
      case AgeUnit.Year:
        return convertToDate(subYears(now, age.age));
      case AgeUnit.Month:
        return convertToDate(subMonths(now, age.age));
      case AgeUnit.Day:
        return convertToDate(subDays(now, age.age));
      default:
        return "1990-01-01";
    }
  }

  toAge(dateStr: string): Age {
    const date = parse(dateStr);
    const now = new Date();
    if (isBefore(subDays(now, this.daysTop), date)) {
      return {
        age: differenceInDays(now, date),
        unit: AgeUnit.Day
      };
    } else if (isBefore(subMonths(now, this.monthsTop), date)) {
      return {
        age: differenceInMonths(now, date),
        unit: AgeUnit.Month
      };
    } else {
      return {
        age: differenceInYears(now, date),
        unit: AgeUnit.Year
      };
    }
  }
}

