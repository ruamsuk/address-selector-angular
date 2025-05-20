import { Component, DestroyRef, EventEmitter, inject, Input, numberAttribute, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { District, Province, Subdistrict } from '../models/province.model';
import { AddressService } from '../services/address.service';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-province-district-subdistrict',
  imports: [SharedModule],
  template: `
    <div class="flex gap-1">
      <!-- Province Selector -->
      <p-treeSelect
        [options]="provinces" [formControl]="provinceName"
        placeholder="จังหวัด"
        (onNodeSelect)="onProvinceChange($event)">
      </p-treeSelect>

      <!-- District Selector -->
      <p-treeSelect
        [options]="districts"
        placeholder="อำเภอ/เขต"
        (onNodeSelect)="onDistrictChange($event)"
        [disabled]="!selectedProvinceValue">
      </p-treeSelect>

      <!-- Subdistrict Selector -->
      <p-treeSelect
        [options]="subdistricts"
        placeholder="ตำบล/แขวง"
        (onNodeSelect)="onSubdistrictChange($event)"
        [disabled]="!selectedDistrictValue">
      </p-treeSelect>
    </div>
  `,
  styles: ``
})
export class ProvinceDistrictSubdistrictComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  /* ใช้ @Input() เพื่อรับค่าจาก Parent Component */
  @Input({transform: numberAttribute}) selectedProvince: number | null = null; // รับค่าจังหวัดจาก Parent
  @Input({transform: numberAttribute}) selectedDistrict: number | null = null; // รับค่าอำเภอจาก Parent
  @Input({transform: numberAttribute}) selectedSubdistrict: number | null = null; // รับค่าตำบลจาก Parent
  @Input() selectedSubdistrictZipCode: string | null = null; // รับค่ารหัส ปณ.จาก Parent

  @Output() provinceSelected = new EventEmitter<string>(); // ส่งค่าจังหวัดกลับไปยัง Parent
  @Output() districtSelected = new EventEmitter<string>(); // ส่งค่าอำเภอกลับไปยัง Parent
  @Output() subdistrictSelected = new EventEmitter<string>(); // ส่งค่าตำบลกลับไปยัง Parent

  provinces: { label: string, value: number }[] = [];
  districts: { label: string, value: number }[] = [];
  subdistricts: { label: string, value: number, zipCode: string }[] = [];
  // ใช้เก็บค่าที่เลือกจาก TreeSelect
  selectedProvinceValue: number | null = null;
  selectedDistrictValue: number | null = null;

  provinceName = new FormControl(); // สร้าง FormControl สำหรับจังหวัด
  districtField = new FormControl(); // สร้าง FormControl สำหรับอำเภอ
  subdistrictField = new FormControl(); // สร้าง FormControl สำหรับตำบล

  constructor(private addressService: AddressService) {
  }

  ngOnInit(): void {
    this.loadProvinces();

    /** ตรวจสอบค่าเริ่มต้นจาก Input */
    if (this.selectedProvince) {
      console.log('Selected Province: ', this.selectedProvince);
      this.provinceName.setValue(this.selectedProvince); // ส่งค่าจังหวัดไปยัง TreeSelect
      this.selectedProvinceValue = this.selectedProvince;
      this.onProvinceChange({node: {value: this.selectedProvince}});
    }
    if (this.selectedDistrict) {
      console.log('Selected District: ', this.selectedDistrict);
      this.districtField.setValue(this.selectedDistrict); // ส่งค่าอำเภอไปยัง TreeSelect
      this.selectedDistrictValue = this.selectedDistrict;
      this.onDistrictChange({node: {value: this.selectedDistrict}});
    }
    if (this.selectedSubdistrict) {
      console.log('Selected Subdistrict: ', this.selectedSubdistrict);
      this.subdistrictField.setValue(this.selectedSubdistrict); // ส่งค่าตำบลไปยัง TreeSelect
      this.onSubdistrictChange({node: {value: this.selectedSubdistrict}});
    }
    if (this.selectedSubdistrictZipCode) {
      console.log('Selected Subdistrict Zip Code: ', this.selectedSubdistrictZipCode);
      this.subdistrictSelected.emit(this.selectedSubdistrictZipCode); // ส่งรหัส ปณ.กลับไปยัง Parent
    }
  }

  loadProvinces(): void {
    this.addressService.getProvinces()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: Province[]) => {
        this.provinces = data
          .sort((a, b) => a.name_th.localeCompare(b.name_th))
          .map(province => ({
            label: province.name_th,
            value: province.id,
          }));
      });
  }

  onProvinceChange(event: any): void {
    this.selectedProvinceValue = event.node.value;
    this.districts = [];
    this.subdistricts = [];

    this.addressService.getDistricts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: District[]) => {
        this.districts = data
          .filter(district => district.province_id === this.selectedProvinceValue)
          .sort((a, b) => a.name_th.localeCompare(b.name_th))
          .map(district => ({
            label: district.name_th,
            value: district.id,
          }));
        this.provinceSelected.emit(event.node.label); // ส่งขื่อจังหวัดกลับไปยัง Parent
      });
  }

  onDistrictChange(event: any): void {
    this.selectedDistrictValue = event.node.value;
    this.subdistricts = [];

    this.addressService.getSubdistricts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: Subdistrict[]) => {
        this.subdistricts = data
          .filter(subdistrict => subdistrict.amphure_id === this.selectedDistrictValue)
          .sort((a, b) => a.name_th.localeCompare(b.name_th))
          .map(subdistrict => ({
            label: subdistrict.name_th,
            value: subdistrict.id,
            zipCode: subdistrict.zip_code,
          }));
        this.districtSelected.emit(event.node.label); // ส่งชื่ออำเภอกลับไปยัง Parent
      });
  }

  onSubdistrictChange(event: any): void {
    this.subdistrictSelected.emit(event.node); // ส่งชื่อตำบลและรหัส ปณ.กลับไปยัง Parent
  }
}
