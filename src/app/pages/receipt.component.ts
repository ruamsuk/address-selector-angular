import { Component } from '@angular/core';
import { ProvinceDistrictSubdistrictComponent } from '../components/province-district-subdistrict.component';
import { SharedModule } from '../shared/shared.module';

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
    <div class="flex items-center justify-center mt-4">
      @if (zipCode) {
        <p-message severity="info" text="รหัสไปรษณีย์: " icon="pi pi-info-circle" styleClass="mb-2">
          <span class="text-green-400">{{ zipCode }}</span>
        </p-message>
      }
    </div>
  `,
  styles: ``
})
export class ReceiptComponent {
  initialProvince: number | null = 1; // ค่าเริ่มต้นของจังหวัด
  initialDistrict: number | null = 1001; // ค่าเริ่มต้นของอำเภอ
  initialSubdistrict: number | null = 100101; // ค่าเริ่มต้นของตำบล

  zipCode: string | null = null; // ใช้เก็บรหัสไปรษณีย์

  onProvinceSelected(provinceId: string): void {
    console.log('Province Selected:', provinceId);
  }

  onDistrictSelected(districtId: string): void {
    console.log('District Selected:', districtId);
  }

  onSubdistrictSelected(subdistrictId: any): void {
    console.log('Subdistrict Selected:', subdistrictId.label);
    console.log('Subdistrict ZipCode:', subdistrictId.zipCode);
    this.zipCode = subdistrictId.zipCode;
  }
}
