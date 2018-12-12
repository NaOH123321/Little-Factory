import { Component, OnInit, OnDestroy, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, FormControl } from '@angular/forms';
import { Subscription, Subject, combineLatest, Observable } from 'rxjs';
import { IdentityType, Identity } from '../../domain';
import { isValidAddr, extractInfo } from '../../utils/identity.util';
import { isValidDate } from '../../utils/date.util';

@Component({
  selector: 'app-identity-input',
  templateUrl: './identity-input.component.html',
  styleUrls: ['./identity-input.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => IdentityInputComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => IdentityInputComponent), multi: true }
  ]
})
export class IdentityInputComponent implements OnInit, OnDestroy, ControlValueAccessor {

  identityTypes = [
    { value: IdentityType.IdCard, label: "身份证" },
    { value: IdentityType.Insurance, label: "医保" },
    { value: IdentityType.Military, label: "军官证" },
    { value: IdentityType.Passport, label: "护照" },
    { value: IdentityType.Other, label: "其它" },
  ];
  identity: Identity = { identityNo: null, identityType: null };
  private _idType = new Subject<IdentityType>();
  private _idNo = new Subject<string>();
  constructor() { }

  private propagateChange = (_: any) => { };
  private sub: Subscription;

  ngOnInit() {
    const val$ = combineLatest(this.idNo$, this.idType$, (_id, _type) => <Identity>{
      identityType: _type,
      identityNo: _id
    });
    this.sub = val$.subscribe(v => this.propagateChange(v));
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  writeValue(obj: Identity): void {
    if (obj)
      this.identity = obj;
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
    switch (val.identityType) {
      case IdentityType.IdCard:
        return this.validateIdCard(c);
      case IdentityType.Passport:
        return this.validatePassport(c);
      case IdentityType.Military:
        return this.validateMilitary(c);
      case IdentityType.Insurance:
      default:
        return null;
    }
  }

  validateIdCard(c: FormControl): { [key: string]: any } {
    const val = c.value.identityNo;
    if (val.length !== 18)
      return { idInvalid: true };

    let result = false;
    const pattern = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}[x0-9]$/;
    if (pattern.test(val)) {
      const info = extractInfo(val);
      if (isValidAddr(info.addrCode) && isValidDate(info.dateOfBirth))
        result = true;
    }
    return result ? null : { idInvalid: true };
  }

  validatePassport(c: FormControl): { [key: string]: any } {
    const val = c.value.identityNo;
    if (val.length !== 9) {
      return { idInvalid: true };
    }
    const pattern = /^[GgEe]\d{8}$/;
    return pattern.test(val) ? null : { idInvalid: true };
  }

  validateMilitary(c: FormControl): { [key: string]: any } {
    const val = c.value.identityNo;
    const pattern = /[\u4e00-\u9fa5](字第)(\d{4,8})(号?)$/;
    return pattern.test(val) ? null : { idInvalid: true };
  }

  onIdTypeChange(idType: IdentityType) {
    this._idType.next(idType);
  }

  private get idType$(): Observable<IdentityType> {
    return this._idType.asObservable();
  }

  onIdNoChange(idNo: string) {
    this._idNo.next(idNo);
  }

  private get idNo$(): Observable<string> {
    return this._idNo.asObservable();
  }
}
