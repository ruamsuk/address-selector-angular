import { Component, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { CustomDatepickerComponent } from '../components/custom-datepicker.component';
import { Merchant } from '../models/merchant.model';
import { ReceiptDataService } from '../services/receipt-data.service';
import { ToastService } from '../services/toast.service';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-receipt',
  imports: [SharedModule, CustomDatepickerComponent],
  template: `
    <div class="flex justify-center items-center mt-2 mx-2 md:mt-16">
      <div class="card w-full max-w-4xl">
        <h2 class="text-center text-2xl font-bold mb-4">ใบเสร็จรับเงิน</h2>
        <div class="flex justify-between w-full">
          <p>
            <app-custom-datepicker
              [selectedYearInput]="year"
              [selectedMonthInput]="month"
              (dateSelected)="onDateSelected($event)">
              >
            </app-custom-datepicker>
          </p>
          <p><span class="font-bold">เล่มที่:</span><span class="font-bold">เลขที่:</span></p>
        </div>
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
      <div class="card w-full max-w-4xl">
        <p-fieldset legend="ข้อมูลผู้ซื้อ"></p-fieldset>
      </div>
    </div>

  `,
  styles: ``

})
export class ReceiptComponent implements OnInit {
  merchantService = inject(ReceiptDataService);
  toastService = inject(ToastService);

  year!: number | null;
  month!: number | null;
  dateSelected!: { year: number; month: number; day: number };


  loading = signal(false);

  ngOnInit(): void {
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
}
