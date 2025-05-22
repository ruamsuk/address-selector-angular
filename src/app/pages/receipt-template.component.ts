import { CurrencyPipe, DecimalPipe, Location } from '@angular/common';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { bahttext } from 'bahttext';
import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { Merchant } from '../models/merchant.model';
import { ReceiptData } from '../models/receipt-data.model';
import { ThaiDatePipe } from '../pipe/thai-date.pipe';
import { AddressService } from '../services/address.service';
import { ReceiptDataService } from '../services/receipt-data.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-receipt-template',
  template: `
    <div class="container mx-auto p-4 m-4 dark:bg-white dark:text-black">
      <div class="flex justify-between items-center mb-2">
        <div class="w-1/4">
          <img src="/images/primeng-logo.png" alt="Logo" class="max-h-16">
        </div>
        <div class="text-right">
          <h2 class="text-xl font-bold">ใบเสร็จรับเงิน / ใบกำกับภาษี</h2>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 mb-2">
        <div>
          <p>วันที่: <span
            class="decoration-dotted underline underline-offset-4">{{ receiptInfo.date | thaiDate: 'fullMonth' }}  </span>
          </p>
        </div>
        <div class="text-right">
          <p>เล่มที่: <span class="decoration-dotted underline underline-offset-4">{{ receiptInfo.bookNumber }} </span>
            เลขที่: <span class="decoration-dotted underline underline-offset-4">{{ receiptInfo.receiptNumber }} </span>
          </p>
        </div>
      </div>

      <div class="leading-8">
        @if (getMerchantData()) {
          @for (merchant of getMerchantData(); track $index) {
            <p>ชื่อผู้ขาย: <span
              class="decoration-dotted underline underline-offset-4">{{ merchant.companyName }} </span></p>
            <p>ที่อยู่: <span class="decoration-dotted underline underline-offset-4">{{ merchant.address.homeStreet }}
              ต.{{ merchant.address.subdistrict }}
              อ.{{ merchant.address.district }} {{ merchant.address.province }} </span></p>
            <p>เลขประจำตัวผู้เสียภาษี: <span
              class="decoration-dotted underline underline-offset-4">{{ merchant.taxId }} </span>
              โทรศัพท์: <span class="decoration-dotted underline underline-offset-4">{{ merchant.phoneNumber }} </span>
            </p>
          }
        }
      </div>

      <div class="my-4"></div>

      <div class="leading-8">
        <p>ชื่อผู้ซื้อ: <span class="decoration-dotted underline underline-offset-4"> {{ customerData.name }} </span>
        </p>
        <p>
          ที่อยู่: <span class="decoration-dotted underline underline-offset-4"> {{ customerData.address }}
          {{ customerData.province == 'กรุงเทพมหานคร' ? 'แขวง' : 'ต.' }}{{ customerData.subdistrict }}
          {{ customerData.province == 'กรุงเทพมหานคร' ? '' : 'อ.' }}{{ customerData.district }}
          {{ customerData.province == 'กรุงเทพมหานคร' ? '' : 'จ.' }}{{ customerData.province }} {{ customerData.zipCode }} </span>
        </p>
        <p>เลขประจำตัวผู้เสียภาษี: <span
          class="decoration-dotted underline underline-offset-8"> {{ customerData.taxId }}</span>
          โทรศัพท์: <span class="decoration-dotted underline underline-offset-8">{{ customerData.phone }} </span></p>
      </div>

      <div class="my-4"></div>

      <div class="border-b border-t border-black py-2">
        <div class="grid grid-cols-6">
          <div>ลำดับ</div>
          <div class="col-span-2 font-semibold">รายการ</div>
          <div class="text-right font-semibold">จำนวน</div>
          <div class="text-right font-semibold">หน่วยละ</div>
          <div class="text-right font-semibold">จำนวนเงิน</div>
        </div>
      </div>

      <div>
        @for (item of items; track item; let i = $index) {
          <div class="grid grid-cols-6 py-1">
            <div>{{ i + 1 }}</div>
            <div class="col-span-2">{{ item.name }}</div>
            <div class="text-right">{{ item.quantity }}</div>
            <div class="text-right">{{ item.unitPrice | number:'1.2-2' }}</div>
            <div class="text-right">{{ (item.quantity * item.unitPrice) | number:'1.2-2' }}</div>
          </div>
        }
      </div>

      <div class="border-t border-black py-2">
        <div class="grid grid-cols-5">
          <div class="col-span-3"></div>
          <div class="col-span-2 text-right">
            <p>มูลค่ารวมก่อนเสียภาษี: {{ subtotal | number:'1.2-2' }}</p>
            <p>ภาษีมูลค่าเพิ่ม (VAT): {{ vatAmount | number:'1.2-2' }}</p>
            <p class="font-bold">ยอดรวม: {{ totalAmount | currency: '':'' }}</p>
          </div>
        </div>
        <p class="italic">(มูลค่าเป็นตัวอักษร) {{ bahttext(totalAmount) }}</p>
      </div>

      <div class="grid grid-cols-2 gap-4 mt-4">
        <div>
          <p>ผู้รับเงิน ........................................</p>
          <p>วันเดือนปี .....................................</p>
        </div>
        <div class="text-right">
          <p>วันเวลาที่พิมพ์: {{ printDateTime | thaiDate: 'mediumt' }}</p>
        </div>

      </div>
      <div class="text-center gap-2">
        <button (click)="printReceipt()"
                class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline print-button cursor-pointer">
          <i class="pi pi-print"></i><span class="ml-2">พิมพ์ใบเสร็จ</span>
        </button>
      </div>
    </div>
  `,
  imports: [
    DecimalPipe,
    CurrencyPipe,
    ThaiDatePipe
  ],
  styles: [`
    /* Styles จะถูกจัดการโดย Tailwind CSS ในไฟล์ CSS หลัก */
  `]
})
export class ReceiptTemplateComponent implements OnInit {
  addressService = inject(AddressService);
  merchantService = inject(ReceiptDataService);
  router: Router = inject(Router);
  @Input() receiptData: ReceiptData | undefined;
  printDateTime: Date = new Date();

  loading = signal(false);

  constructor(
    private location: Location,
    private toastService: ToastService,
  ) {
    // **สำคัญ:** คุณจะต้อง Implement ฟังก์ชันนี้เอง
    // นี่เป็นเพียงตัวอย่างโครงสร้าง (อาจต้องปรับปรุงให้สมบูรณ์)
  }


  ngOnInit(): void {
    const state = this.location.getState() as any;
    console.log('State received in Receipt Template:', state);

    if (typeof state === 'object' && state !== null && 'receiptData' in state) {
      this.receiptData = (state as { receiptData: ReceiptData }).receiptData;
      if (this.receiptData) {
        this.translateAddressToNames(this.receiptData)
          .subscribe({
            next: (translatedData) => {
              this.receiptData = translatedData;
            },
            error: (error) => {
              console.error('Error translating address:', error);
              this.toastService.showError('Error', 'Error translating address');
            }
          });
      }
      console.log('Data received in Receipt Template:', this.receiptData);
    } else {
      console.error('receiptData not found or has incorrect structure in state');
      this.toastService.showError('Error', 'receiptData not found or has incorrect structure in state');
    }
    this.getMerchantData();
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
    {
      initialValue: [],
    }
  );

  get customerData(): any {
    return this.receiptData?.customer || {};
  }

  get receiptInfo(): any {
    return this.receiptData?.receiptInfo || {};
  }

  get items(): any[] {
    return this.receiptData?.items || [];
  }

  get zipCode(): any {
    return this.receiptData?.customer.zipCode;
  }

  get subtotal(): number {
    return this.receiptData?.subtotal || 0;
  }

  get vatAmount(): number {
    return this.receiptData?.vatAmount || 0;
  }

  get totalAmount(): number {
    return this.receiptData?.totalAmount || 0;
  }

  printReceipt(): void {
    window.print();
  }

  // Function to translate address IDs to names
  translateAddressToNames(receiptData: any): Observable<any> {
    return this.addressService.getProvinces().pipe(
      switchMap((provinces: any) => {
        const province = provinces.find((p: any) => p.id === receiptData.customer.province);

        return this.addressService.getDistricts().pipe(
          switchMap((districts: any) => {
            const district = districts.find((d: any) => d.id === receiptData.customer.district);

            return this.addressService.getSubdistricts().pipe(
              switchMap((subdistricts: any) => {
                const subdistrict = subdistricts.find((s: any) => s.id === receiptData.customer.subdistrict);

                return new Observable((observer) => {
                  observer.next({
                    ...receiptData,
                    customer: {
                      ...receiptData.customer,
                      province: province.name_th,
                      district: district.name_th,
                      subdistrict: subdistrict.name_th,
                      zipCode: subdistrict.zip_code,
                    },
                  });
                  observer.complete();
                });
              })
            );
          })
        );
      }),
      catchError((error: any) => {
        console.error('Error fetching address data:', error);
        this.toastService.showError('Error', 'Error fetching address data');
        return throwError(() => error);
      })
    );
  }

  // Function to convert the total amount to Thai Baht text
  protected readonly bahttext = bahttext;
}
