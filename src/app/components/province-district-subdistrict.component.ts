import { Component, DestroyRef, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
        [options]="provinces"
        placeholder="เลือกจังหวัด"
        (onNodeSelect)="onProvinceChange($event)">
      </p-treeSelect>

      <!-- District Selector -->
      <p-treeSelect
        [options]="districts"
        placeholder="เลือกอำเภอ/เขต"
        (onNodeSelect)="onDistrictChange($event)"
        [disabled]="!selectedProvinceValue">
      </p-treeSelect>

      <!-- Subdistrict Selector -->
      <p-treeSelect
        [options]="subdistricts"
        placeholder="เลือกตำบล/แขวง"
        (onNodeSelect)="onSubdistrictChange($event)"
        [disabled]="!selectedDistrictValue">
      </p-treeSelect>
    </div>
  `,
  styles: ``
})
export class ProvinceDistrictSubdistrictComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  /* ใช้ @Input() เพื่อรับค่าจาก Parent Component

  @Input() selectedProvince: number | null = null; // รับค่าจังหวัดจาก Parent
  @Input() selectedDistrict: number | null = null; // รับค่าอำเภอจาก Parent
  @Input() selectedSubdistrict: number | null = null; // รับค่าตำบลจาก Parent
*/
  @Output() provinceSelected = new EventEmitter<string>(); // ส่งค่าจังหวัดกลับไปยัง Parent
  @Output() districtSelected = new EventEmitter<string>(); // ส่งค่าอำเภอกลับไปยัง Parent
  @Output() subdistrictSelected = new EventEmitter<string>(); // ส่งค่าตำบลกลับไปยัง Parent

  provinces: { label: string, value: number }[] = [];
  districts: { label: string, value: number }[] = [];
  subdistricts: { label: string, value: number, zipCode: string }[] = [];
  // ใช้เก็บค่าที่เลือกจาก TreeSelect
  selectedProvinceValue: number | null = null;
  selectedDistrictValue: number | null = null;

  constructor(private addressService: AddressService) {
  }

  ngOnInit(): void {
    this.loadProvinces();
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
