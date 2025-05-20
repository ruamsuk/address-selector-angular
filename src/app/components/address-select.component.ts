import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { District, Province, Subdistrict } from '../models/province.model';
import { AddressService } from '../services/address.service';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-address-select',
  imports: [SharedModule],
  template: `
    <div class="flex gap-2">
      <!-- Province Selector -->
      <p-select
        id="province"
        [options]="provinces"
        placeholder="เลือกจังหวัด"
        [(ngModel)]="selectedProvince"
        optionLabel="name_th"
        optionValue="id"
        (onChange)="onProvinceChange($event)">
      </p-select>

      <!-- District Selector -->
      <p-select
        id="district"
        [options]="districts"
        placeholder="เลือกอำเภอ"
        [(ngModel)]="selectedDistrict"
        optionLabel="name_th"
        optionValue="id"
        (onChange)="onDistrictChange($event)">
      </p-select>

      <!-- Subdistrict Selector -->
      <p-select
        id="subdistrict"
        [options]="subdistricts"
        placeholder="เลือกตำบล"
        [(ngModel)]="selectedSubdistrict"
        optionLabel="name_th"
        optionValue="id"
        (onChange)="onSubdistrictChange($event)">
      </p-select>

      <!-- Zip Code Display -->
      <!--<input
        type="text"
        pInputText
        id="zipCode"
        [value]="zipCode"
        placeholder="รหัส ปณ."
        class="w-20" readonly>-->
    </div>
  `,
  styles: ``
})
export class AddressSelectComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  addressService = inject(AddressService);

  @Input() initialProvince: number | null = null; // รับค่าจังหวัดเริ่มต้นจาก Parent
  @Input() initialDistrict: number | null = null; // รับค่าอำเภอเริ่มต้นจาก Parent
  @Input() initialSubdistrict: number | null = null; // รับค่าตำบลเริ่มต้นจาก Parent

  @Output() addressSelected = new EventEmitter<any>(); // ส่งข้อมูลที่อยู่กลับไปยัง Parent

  provinces: any[] = [];
  districts: any[] = [];
  subdistricts: any[] = [];
  zipCode: string = '';
  selectedProvince: number | null = null;
  selectedDistrict: number | null = null;
  selectedSubdistrict: number | null = null;

  ngOnInit(): void {
    this.loadProvinces();
    if (this.initialProvince) {
      console.log('Selected Province: ', this.initialProvince);
      this.selectedProvince = this.initialProvince;
      this.onProvinceChange({value: this.initialProvince});
    }
    if (this.initialDistrict) {
      console.log('Selected District: ', this.initialDistrict);
      this.selectedDistrict = this.initialDistrict;
      this.onDistrictChange({value: this.initialDistrict});
    }
    if (this.initialSubdistrict) {
      console.log('Selected Subdistrict: ', this.initialSubdistrict);
      this.selectedSubdistrict = this.initialSubdistrict;
      this.onSubdistrictChange({value: this.initialSubdistrict});
    }
  }

  loadProvinces() {
    this.addressService.getProvinces()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: Province[]) => {
        this.provinces = data
          .sort((a, b) => a.name_th.localeCompare(b.name_th))
          .map(province => ({
            name_th: province.name_th,
            id: province.id,
          }));
      });
  }

  onProvinceChange(event: any) {
    this.selectedProvince = event.value;
    this.districts = [];
    this.subdistricts = [];
    this.zipCode = '';

    this.addressService.getDistricts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((districts: District[]) => {
        this.districts = districts.filter(district => district.province_id === this.selectedProvince)
          .sort((a, b) => a.name_th.localeCompare(b.name_th))
          .map(district => ({
            name_th: district.name_th,
            id: district.id,
          }));
      });

    this.emitAddress();
  }

  onDistrictChange(event: any) {
    this.selectedDistrict = event.value;
    console.log('Selected District: ', this.selectedDistrict);
    this.subdistricts = [];
    this.zipCode = '';

    this.addressService.getSubdistricts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((subdistricts: Subdistrict[]) => {
        this.subdistricts = subdistricts
          .filter(subdistrict => subdistrict.amphure_id === this.selectedDistrict)
          .sort((a, b) => a.name_th.localeCompare(b.name_th))
          .map(subdistrict => ({
            name_th: subdistrict.name_th,
            id: subdistrict.id,
            zip_code: subdistrict.zip_code,
          }));
      });

    this.emitAddress();
  }

  onSubdistrictChange(event: any) {
    this.selectedSubdistrict = event.value;
    const selectedSubdistrict = this.subdistricts.find(subdistrict => subdistrict.id === this.selectedSubdistrict);
    if (selectedSubdistrict) {
      this.zipCode = selectedSubdistrict.zip_code;
    }

    this.emitAddress();
  }

  emitAddress() {
    this.addressSelected.emit({
      province: this.selectedProvince,
      district: this.selectedDistrict,
      subdistrict: this.selectedSubdistrict,
      zipCode: this.zipCode,
    });
  }
}
