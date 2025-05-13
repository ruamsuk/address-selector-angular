import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProvinceDistrictSubdistrictComponent } from '../components/province-district-subdistrict.component';
import { Merchant } from '../models/merchant.model';
import { ReceiptDataService } from '../services/receipt-data.service';
import { ToastService } from '../services/toast.service'; // Import Validators
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-merchant-form',
  standalone: true, // Added standalone: true
  imports: [SharedModule, ProvinceDistrictSubdistrictComponent],
  template: `
    <div class="flex justify-center items-center mt-2 md:mt-16">
      <div class="card w-full max-w-4xl">
        <h2 class="text-center text-2xl font-bold mb-4">Merchant Form</h2>
        <p-card>
          <ng-template #header>
            <h3 class="text-lg font-semibold">Merchant Information</h3>
          </ng-template>
          <form [formGroup]="merchantForm" (ngSubmit)="onSubmit()" class="merchant-form">
            <!-- Company Name -->
            <div class="field">
              <label for="companyName">Company Name:</label>
              <input id="companyName" type="text" pInputText formControlName="companyName" placeholder="Company Name"/>
              <small class="p-error"
                     *ngIf="merchantForm.get('companyName')?.invalid && merchantForm.get('companyName')?.dirty">Company
                Name is required.</small>
            </div>

            <!-- Address -->
            <div formGroupName="address">
              <h4>Address:</h4>
              <div class="field">
                <label for="homeStreet">Home Number & Street:</label>
                <input id="homeStreet" type="text" pInputText formControlName="homeStreet"
                       placeholder="Home Number & Street"/>
                <small class="p-error"
                       *ngIf="merchantForm.get('address.homeStreet')?.invalid && merchantForm.get('address.homeStreet')?.dirty">Home
                  Number & Street is required.</small>
              </div>
              <div class="field">
                <label for="province">Province:</label>
                <app-province-district-subdistrict
                  (provinceSelected)="onProvinceSelected($event)"
                  (districtSelected)="onDistrictSelected($event)"
                  (subdistrictSelected)="onSubdistrictSelected($event)">
                </app-province-district-subdistrict>
              </div>
              <div class="field">
                <label for="zipCode">ZipCode:</label>
                <input id="zipCode" type="text" pInputText formControlName="zipCode" placeholder="ZipCode" readonly
                       value="{{zipCode}}"/>
                <small class="p-error"
                       *ngIf="merchantForm.get('address.zipCode')?.invalid && merchantForm.get('address.zipCode')?.dirty">ZipCode
                  is required.</small>
              </div>
            </div>

            <!-- Phone Number -->
            <div class="field">
              <label for="phoneNumber">Phone Number:</label>
              <input id="phoneNumber" type="text" pInputText formControlName="phoneNumber" placeholder="Phone Number"/>
              <small class="p-error"
                     *ngIf="merchantForm.get('phoneNumber')?.invalid && merchantForm.get('phoneNumber')?.dirty">Phone
                Number is required.</small>
            </div>

            <!-- เลขประจำตัวผู้เสียภาษี -->
            <div class="field">
              <label for="taxId">เลขประจำตัวผู้เสียภาษี:</label>
              <input id="taxId" type="text" pInputText formControlName="taxId" placeholder="เลขประจำตัวผู้เสียภาษี"/>
              <small class="p-error" *ngIf="merchantForm.get('taxId')?.invalid && merchantForm.get('taxId')?.dirty">เลขประจำตัวผู้เสียภาษี
                is required.</small>
            </div>

            <div class="flex justify-center">
              <button type="submit"
                      pButton severity="primary"
                      class="mt-4"
                      [disabled]="merchantForm.invalid"> <!-- Disable button if form is invalid -->
                <span pButtonLabel>Submit</span>
              </button>
            </div>
          </form>
        </p-card>
      </div>
    </div>
  `,
  styles: ``
})
export class MerchantFormComponent {
  receiptDataService = inject(ReceiptDataService);
  toastService = inject(ToastService);

  merchantForm = new FormGroup({
    companyName: new FormControl('', Validators.required), // Added Validators.required
    address: new FormGroup({
      homeStreet: new FormControl('', Validators.required), // Added Validators.required
      province: new FormControl('', Validators.required), // Added Validators.required
      district: new FormControl('', Validators.required), // Added Validators.required
      subdistrict: new FormControl('', Validators.required), // Added Validators.required
      zipCode: new FormControl('', Validators.required), // Added Validators.required
    }),
    phoneNumber: new FormControl('', Validators.required), // Added Validators.required
    taxId: new FormControl('', Validators.required) // Added Validators.required
  });
  /** Function to handle province selection
   ไม่ต้องใช้ เพราะไม่ต้องรับค่าอะไนจาก parent component */
    // initialProvince: number | null = 1; // ค่าเริ่มต้นของจังหวัด
    // initialDistrict: number | null = 1001; // ค่าเริ่มต้นของอำเภอ
    // initialSubdistrict: number | null = 100101; // ค่าเริ่มต้นของตำบล

  zipCode: string | null = null; // ใช้เก็บรหัสไปรษณีย์

  onProvinceSelected(provinceId: string): void {
    console.log('Province Selected:', provinceId);
    this.merchantForm.get('address.province')?.setValue(provinceId);
  }

  onDistrictSelected(districtId: string): void {
    console.log('District Selected:', districtId);
    this.merchantForm.get('address.district')?.setValue(districtId);
  }

  onSubdistrictSelected(subdistrictId: any): void {
    console.log('Subdistrict Selected:', subdistrictId.label);
    console.log('Subdistrict ZipCode:', subdistrictId.zipCode);
    this.merchantForm.get('address.subdistrict')?.setValue(subdistrictId.label);
    this.merchantForm.get('address.zipCode')?.setValue(subdistrictId.zipCode);
    this.zipCode = subdistrictId.zipCode;
  }

  onSubmit() {
    console.log('Form Submitted:', this.merchantForm.value);
    const formValue = this.merchantForm.value;

    // Map the form values to the Merchant type, handling potential nulls
    const newMerchant: Merchant = {
      companyName: formValue.companyName || '', // Provide default empty string for string properties
      phoneNumber: formValue.phoneNumber || '',
      taxId: formValue.taxId || '',
      address: {
        homeStreet: formValue.address?.homeStreet || '',
        province: formValue.address?.province || '',
        district: formValue.address?.district || '',
        subdistrict: formValue.address?.subdistrict || '',
        zipCode: formValue.address?.zipCode || '',
      },
      // id and timestamps are optional and not from the form, so they are omitted here
    };

    // You can now use newMerchant
    console.log('Mapped Merchant:', newMerchant);
    // Call the service to save the new merchant
    this.receiptDataService.addMerchantData(newMerchant).subscribe({
      next: (response) => {
        this.toastService.showSuccess('Successfully', `Merchant added successfully: ${response.id}`);
      },
      error: (error) => {
        this.toastService.showError('Error', `Error adding merchant: ${error.message}`);
      }
    });
  }
}
