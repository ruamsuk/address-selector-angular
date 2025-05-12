import { Component } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { ProvinceDistrictSubdistrictComponent } from '../components/province-district-subdistrict.component';

@Component({
  selector: 'app-receipt',
  imports: [SharedModule, ProvinceDistrictSubdistrictComponent],
  template: `
    <div class="flex justify-center items-center my-5">
      <app-province-district-subdistrict
        [selectedProvince]="initialProvince"
        [selectedDistrict]="initialDistrict"
        [selectedSubdistrict]="initialSubdistrict"
        (provinceSelected)="onProvinceSelected($event)"
        (districtSelected)="onDistrictSelected($event)"
        (subdistrictSelected)="onSubdistrictSelected($event)">
      </app-province-district-subdistrict>
    </div>
  `,
  styles: ``
})
export class ReceiptComponent {
  initialProvince: number | null = 1; // ค่าเริ่มต้นของจังหวัด
  initialDistrict: number | null = 1001; // ค่าเริ่มต้นของอำเภอ
  initialSubdistrict: number | null = 100101; // ค่าเริ่มต้นของตำบล

  onProvinceSelected(provinceId: string): void {
    console.log('Province Selected:', provinceId);
  }

  onDistrictSelected(districtId: string): void {
    console.log('District Selected:', districtId);
  }

  onSubdistrictSelected(subdistrictId: string): void {
    console.log('Subdistrict Selected:', subdistrictId);
  }
}
