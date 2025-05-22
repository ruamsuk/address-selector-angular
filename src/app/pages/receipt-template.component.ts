import { CurrencyPipe, DatePipe, DecimalPipe, Location, NgForOf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { bahttext } from 'bahttext';

@Component({
  selector: 'app-receipt-template',
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-2">
        <div class="w-1/4">
          <!--          <img src="path/to/your/logo.png" alt="Logo" class="max-h-16">-->
        </div>
        <div class="text-right">
          <h2 class="text-xl font-bold">ใบเสร็จรับเงิน / ใบกำกับภาษี</h2>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 mb-2">
        <div>
          <p>วันที่: {{ receiptInfo.date | date }}</p>
        </div>
        <div class="text-right">
          <p>เล่มที่: {{ receiptInfo.bookNumber }} เลขที่: {{ receiptInfo.receiptNumber }}</p>
        </div>
      </div>

      <div>
        <p>ชื่อผู้ขาย: {{ sellerData.name }}</p>
        <p>ที่อยู่: {{ sellerData.address }}</p>
        <p>เลขประจำตัวผู้เสียภาษี: {{ sellerData.taxId }} โทรศัพท์: {{ sellerData.phone }}</p>
      </div>

      <div class="my-4"></div>

      <div>
        <p>ชื่อผู้ซื้อ: {{ customerData.name }}</p>
        <p>ที่อยู่: {{ customerData.address }}</p>
        <p>เลขประจำตัวผู้เสียภาษี: {{ customerData.taxId }} โทรศัพท์: {{ customerData.phone }}</p>
      </div>

      <div class="my-4"></div>

      <div class="border-b border-gray-400 py-2">
        <div class="grid grid-cols-6">
          <div>ลำดับ</div>
          <div class="col-span-2 font-semibold">รายการ</div>
          <div class="text-right font-semibold">จำนวน</div>
          <div class="text-right font-semibold">หน่วยละ</div>
          <div class="text-right font-semibold">จำนวนเงิน</div>
        </div>
      </div>

      <div *ngFor="let item of items; let i = index">
        <div class="grid grid-cols-6 py-1">
          <div>{{ i + 1 }}</div>
          <div class="col-span-2">{{ item.name }}</div>
          <div class="text-right">{{ item.quantity }}</div>
          <div class="text-right">{{ item.unitPrice | number:'1.2-2' }}</div>
          <div class="text-right">{{ (item.quantity * item.unitPrice) | number:'1.2-2' }}</div>
        </div>
      </div>

      <div class="border-t border-gray-400 py-2">
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
          <p>วันเดือนปี ....................................</p>
        </div>
        <div class="text-right">
          <p>วันเวลาที่พิมพ์: {{ printDateTime | date:'dd/MM/yyyy HH:mm:ss' }}</p>
          <button (click)="printReceipt()"
                  class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline print-button">
            พิมพ์ใบเสร็จ
          </button>
          <div class="my-2">
            <button (click)="closeReceipt()"
                    class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline print-button">
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  `,
  imports: [
    DatePipe,
    DecimalPipe,
    NgForOf,
    CurrencyPipe
  ],
  styles: [`
    /* Styles จะถูกจัดการโดย Tailwind CSS ในไฟล์ CSS หลัก */
    @media print {
      .print-button {
        display: none;
      }

      .container {
        border: none;
        margin: 0;
        padding: 0;
        max-width: none;
      }
    }
  `]
})
export class ReceiptTemplateComponent implements OnInit {
  @Input() receiptData: any;
  printDateTime: Date = new Date();

  // thaiBaht: string = '';

  constructor(private location: Location) {
    // **สำคัญ:** คุณจะต้อง Implement ฟังก์ชันนี้เอง
    // นี่เป็นเพียงตัวอย่างโครงสร้าง (อาจต้องปรับปรุงให้สมบูรณ์)
  }

  ngOnInit(): void {
    const state = this.location.getState();
    console.log('State received in Receipt Template:', state);
    // @ts-ignore
    this.receiptData = state['receiptData'];
    console.log('Data received in Receipt Template:', this.receiptData);

    // if (this.receiptData && this.receiptData.totalAmount !== undefined) {
    //   this.thaiBaht = ThaiBahtText(this.receiptData.totalAmount);
    //   console.log('Thai Baht:', this.thaiBaht);
    // }
  }

  get sellerData(): any {
    return this.receiptData?.seller || {};
  }

  get customerData(): any {
    return this.receiptData?.customer || {};
  }

  get receiptInfo(): any {
    return this.receiptData?.receiptInfo || {};
  }

  get items(): any[] {
    return this.receiptData?.items || [];
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

  convertToThaiBaht(amount: number): string {
    // **สำคัญ:** คุณจะต้อง Implement ฟังก์ชันนี้เอง
    // นี่เป็นเพียงตัวอย่างโครงสร้าง (อาจต้องปรับปรุงให้สมบูรณ์)
    const thaiNumber = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า', 'สิบ'];
    const unit = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];

    function convert(amount: number): string {
      if (amount === 0) return thaiNumber[0];
      let result = '';
      let temp = amount.toString();
      let length = temp.length;

      for (let i = 0; i < length; i++) {
        let digit = parseInt(temp[i]);
        let power = length - i - 1;

        if (digit !== 0) {
          if (power === 1 && digit === 1 && length > 1) {
            result += '';
          } else if (power === 1 && digit === 2) {
            result += 'ยี่';
          } else if (digit === 1 && power !== 0) {
            result += 'เอ็ด';
          } else {
            result += thaiNumber[digit];
          }
          result += unit[power];
        }
      }
      return result;
    }

    const integerPart = Math.floor(amount);
    const decimalPart = Math.round((amount - integerPart) * 100);
    let result = convert(integerPart) + 'บาท';

    if (decimalPart > 0) {
      result += convert(decimalPart) + 'สตางค์';
    } else {
      result += 'ถ้วน';
    }

    return result;
  }

  printReceipt(): void {
    window.print();
    this.closeReceipt();
  }

  closeReceipt() {
    this.location.back();
  }


  protected readonly bahttext = bahttext;
}
