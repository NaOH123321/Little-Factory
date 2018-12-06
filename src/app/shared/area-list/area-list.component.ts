import { Component, OnInit, OnDestroy, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, FormControl } from '@angular/forms';
import { Subscription, Subject, Observable, combineLatest, of } from 'rxjs';
import { Address } from './../../domain';
import { getProvinces, getCitiesByProvince, getAreasByCity } from './../../utils/area.util';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-area-list',
  templateUrl: './area-list.component.html',
  styleUrls: ['./area-list.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AreaListComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => AreaListComponent), multi: true }
  ]
})
export class AreaListComponent implements OnInit, OnDestroy, ControlValueAccessor {


  private _province = new Subject<string>();
  private _city = new Subject<string>();
  private _district = new Subject<string>();
  private _street = new Subject<string>();
  provinces$: Observable<string[]>;
  cities$: Observable<string[]>;
  districts$: Observable<string[]>;
  address: Address = {
    province: '',
    city: '',
    district: '',
    street: ''
  };
  constructor() { }

  private propagateChange = (_: any) => { };
  private sub: Subscription;

  ngOnInit() {
    const province$ = this._province.asObservable();
    const city$ = this._city.asObservable();
    const district$ = this._district.asObservable();
    const street$ = this._street.asObservable();
    const val$ = combineLatest(province$, city$, district$, street$, (_p, _c, _d, _s) => <Address>{
      province: _p,
      city: _c,
      district: _d,
      street: _s
    });
    this.sub = val$.subscribe(v => this.propagateChange(v));

    this.provinces$ = of(getProvinces());
    this.cities$ = province$.pipe(map(p => getCitiesByProvince(p)));
    this.districts$ = combineLatest(province$, city$, (p, c) => getAreasByCity(p, c));
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  writeValue(obj: Address): void {
    if (obj) {
      this.address = obj;
      if (this.address.province)
        this._province.next(this.address.province);
      if (this.address.city)
        this._city.next(this.address.city);
      if (this.address.district)
        this._district.next(this.address.district);
      if (this.address.street)
        this._street.next(this.address.street);
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
    if (val.province && val.city && val.district && val.street)
      return null;

    return { addressInvalid: true };
  }

  onProvinceChange() {
    this._province.next(this.address.province);
  }

  onCityChange() {
    this._city.next(this.address.city);
  }

  onDistrictChange() {
    this._district.next(this.address.district);
  }

  onStreetChange() {
    this._street.next(this.address.street);
  }
}
