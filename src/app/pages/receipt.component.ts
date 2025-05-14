import { Component, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { bahttext } from 'bahttext';
import { NgxCurrencyDirective } from 'ngx-currency';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ProvinceDistrictSubdistrictComponent } from '../components/province-district-subdistrict.component';
import { Merchant } from '../models/merchant.model';
import { ReceiptDataService } from '../services/receipt-data.service';
import { ToastService } from '../services/toast.service';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-receipt',
  imports: [SharedModule, ProvinceDistrictSubdistrictComponent, NgxCurrencyDirective],
  template: `
    <div class="flex justify-center items-center mt-2 mx-2 md:mt-16">
      <div class="card w-full max-w-4xl">
        <h2 class="text-center text-2xl font-bold mb-4">สร้างใบเสร็จรับเงิน</h2>
        @if (getMerchantData()) {
          @for (merchant of getMerchantData(); track $index) {
            <div class="mb-4">
              <p-fieldset legend="ข้อมูลผู้ขาย">
                <p><strong>ชื่อผู้ขาย</strong>: {{ merchant.companyName }}</p>
                <p><strong>ที่อยู่</strong>:
                  {{ merchant.address.homeStreet }}
                  ตำบล{{ merchant.address.subdistrict }}
                  อำเภอ{{ merchant.address.district }}
                  จังหวัด{{ merchant.address.province }}
                  , {{ merchant.address.zipCode }}</p>
                <p><strong>เลขประจำตัวผู้เสียภาษี</strong>: {{ merchant.taxId }}
                  <strong>โทรศัพท์</strong>: {{ merchant.phoneNumber }}</p>
              </p-fieldset>
            </div>
          }
        }
      </div>
    </div>
    <div class="flex justify-center items-center mx-2">
      <form [formGroup]="receiptForm" (ngSubmit)="onSubmit()">
        <div class="card w-full max-w-4xl">
          <p-fieldset legend="ข้อมูลผู้ซื้อ">
            <div class="grid grid-cols-2 gap-4" formGroupName="customer">
              <div>
                <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" for="customerName">ชื่อผู้ซื้อ</label>
                <input type="text" id="customerName" formControlName="name"
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline">
              </div>
              <div>
                <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" for="customerPhone">โทรศัพท์</label>
                <input type="text" id="customerPhone" formControlName="phone"
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline">
              </div>
              <div>
                <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" for="customerAddress">ที่อยู่
                  เลขที่
                  ถนน</label>
                <input id="customerAddress" formControlName="address"
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"/>
              </div>
              <div>
                <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                       for="customerTaxId">เลขประจำตัวผู้เสียภาษี</label>
                <input type="text" id="customerTaxId" formControlName="taxId"
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline">
              </div>
              <div>
                <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                       for="customerAddressSelector">จังหวัด อำเภอ ตำบล</label>
                <app-province-district-subdistrict
                  (provinceSelected)="onProvinceSelected($event)"
                  (districtSelected)="onDistrictSelected($event)"
                  (subdistrictSelected)="onSubdistrictSelected($event)">>
                </app-province-district-subdistrict>
              </div>
              <div>
                <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" for="customerZipCode">รหัสไปรษณีย์</label>
                <input id="customerZipCode" formControlName="zipCode" readonly
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"/>
              </div>
            </div>
          </p-fieldset>
        </div>
        <div class="card w-full max-w-4xl">
          <p-fieldset legend="ข้อมูลใบเสร็จ">
            <div class="grid grid-cols-3 gap-4" formGroupName="receiptInfo">
              <div>
                <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                       for="receiptDate">วันที่</label>
                <p-datePicker
                  formControlName="date"
                  [iconDisplay]="'input'"
                  [showIcon]="true"
                  inputId="icondisplay"
                  appendTo="body" styleClass="w-full"/>
              </div>
              <div>
                <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                       for="bookNumber">เล่มที่</label>
                <input type="text" id="bookNumber" formControlName="bookNumber"
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline">
              </div>
              <div>
                <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                       for="receiptNumber">เลขที่</label>
                <input type="text" id="receiptNumber" formControlName="receiptNumber"
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline">
              </div>
            </div>
          </p-fieldset>
          <div class="card w-full max-w-4xl">
            <div class="mb-4 border-b border-gray-300 pb-2">
              <h3 class="font-semibold mb-2">รายการสินค้า/บริการ</h3>
              <div formArrayName="items">
                <div>
                  @for (item of items.controls; track item; let i = $index) {
                    <div class="flex items-center gap-4" [formGroupName]="i">
                      <div class="flex-1/4">
                        <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                               [for]="'itemName' + i">รายการ {{ i + 1 }}</label>
                        <input type="text" [id]="'itemName' + i" formControlName="name"
                               class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline">
                      </div>
                      <div class="flex-1/6">
                        <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                               [for]="'quantity' + i">จำนวน</label>
                        <input type="number" [id]="'quantity' + i" formControlName="quantity" min="1"
                               class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline">
                      </div>
                      <div class="flex-1/5">
                        <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                               [for]="'unitPrice' + i">หน่วยละ</label>
                        <input currencyMask [id]="'unitPrice' + i" formControlName="unitPrice" min="0"
                               class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline">
                      </div>
                      <div class="flex-1/6">
                        <div class="text-right text-red-600 font-semibold mt-7">
                          {{ (item.get('quantity')?.value * item.get('unitPrice')?.value) | number:'1.2-2' }}
                        </div>
                      </div>
                      <div class="flex-1 mt-7">
                        <p-button (click)="removeItem(i)" icon="pi pi-times" severity="secondary"/>
                      </div>
                    </div>
                  }
                </div>
                <div class="my-3">
                  <p-button (click)="addItem()" label="เพิ่มรายการ" icon="pi pi-plus" class="p-button-rounded"/>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-between items-center my-3">
            <div>({{ bahttext(receiptForm.get('totalAmount')?.value) }})</div>
          </div>

          <div class="mb-4 text-right">
            <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" for="vatRate">อัตราภาษีมูลค่าเพิ่ม
              (%)</label>
            <input type="number" id="vatRate" formControlName="vatRate" min="0" max="100"
                   class="shadow appearance-none border rounded w-1/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            %
          </div>
        </div>
        <div class="mb-4 text-right">
          <p>มูลค่ารวมก่อนเสียภาษี: {{ receiptForm.get('subtotal')?.value | number:'1.2-2' }}</p>
          <p>ภาษีมูลค่าเพิ่ม (VAT): {{ receiptForm.get('vatAmount')?.value | number:'1.2-2' }}</p>
          <h3 class="font-bold">ยอดรวม: {{ receiptForm.get('totalAmount')?.value | number:'1.2-2' }}</h3>
        </div>


        <div class="mb-5">
          <button type="submit" (click)="onSubmit()"
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            สร้างใบเสร็จ
          </button>
        </div>
      </form>
    </div>

  `,
  styles: ``

})
export class ReceiptComponent implements OnInit {
  merchantService = inject(ReceiptDataService);
  toastService = inject(ToastService);
  router = inject(Router);
  fb = inject(FormBuilder);
  receiptForm!: FormGroup;

  year!: number | null;
  month!: number | null;
  dateSelected!: { year: number; month: number; day: number };


  loading = signal(false);

  ngOnInit(): void {
    this.getMerchantData();
    this.receiptForm = this.fb.group({
      customer: this.fb.group({
        name: ['', Validators.required],
        address: [''],
        taxId: [''],
        phone: [''],
        zipCode: ['']
      }),
      receiptInfo: this.fb.group({
        date: [new Date(), Validators.required],
        bookNumber: [''],
        receiptNumber: ['', Validators.required]
      }),
      items: this.fb.array([this.createItem()]),
      subtotal: [0],
      vatRate: [7], // Default VAT rate
      vatAmount: [0],
      totalAmount: [0]
    });

    this.items.valueChanges.subscribe(() => {
      this.calculateTotals();
    });

    this.receiptForm.get('vatRate')?.valueChanges.subscribe(() => {
      this.calculateTotals();
    });
    this.receiptForm.get('customer.zipCode')?.reset();
  }

  get items(): FormArray {
    return this.receiptForm.get('items') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]]
    });
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  calculateTotals(): void {
    let subtotal = 0;
    this.items.controls.forEach(item => {
      const quantity = item.get('quantity')?.value;
      const unitPrice = item.get('unitPrice')?.value;
      subtotal += quantity * unitPrice;
    });
    this.receiptForm.patchValue({subtotal: subtotal});

    const vatRate = this.receiptForm.get('vatRate')?.value / 100;
    const vatAmount = subtotal * vatRate;
    this.receiptForm.patchValue({vatAmount: vatAmount});

    this.receiptForm.patchValue({totalAmount: subtotal + vatAmount});
  }

  getMerchantData = toSignal(
    (this.merchantService.getMerchantData() as Observable<Merchant[]>)
      .pipe(
        tap(() => this.loading.set(false)),
        catchError((error: any) => {
            this.toastService.showError('', `Error fetching data: ${error.message}`);
            return throwError(() => error);
          }
        )
      ),
    {initialValue: []}
  );

  onDateSelected(date: { year: number; month: number; day: number }) {
    console.log('Date Selected: ', date);
    const formattedDate = this.formatDateForFirestore(date);
    console.log('Formatted Date:', formattedDate);
  }

  formatDateForFirestore(date: { year: any, month: any, day: number }): { year: number, month: number, day: number } {
    return {
      year: date.year.value - 543, // แปลงพุทธศักราชเป็นคริสตศักราช
      month: date.month.value,     // เดือนที่ถูกเลือก
      day: date.day                // วันที่ถูกเลือก
    };
  }

  onSubmit(): void {
    if (this.receiptForm.valid) {
      const receiptData = this.receiptForm.value;
      this.router.navigate(['/receipt-template'], {state: {receiptData}});
      console.log('Navigating to receipt-template with data:', receiptData);
    }
  }

  onProvinceSelected($event: string) {

  }

  onDistrictSelected($event: string) {

  }

  onSubdistrictSelected(event: any) {
    this.receiptForm.get('customer.zipCode')?.setValue(event.zipCode);
  }

  protected readonly bahttext = bahttext;
}
