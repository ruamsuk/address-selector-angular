import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-dialog-print',
  imports: [SharedModule],
  template: `
    <div class="flex justify-center items-center container mx-auto">
      <p-button label="แสดงข้อมูล" icon="pi pi-info" (click)="showDialog()"></p-button>
    </div>
    <p-dialog header="รายละเอียด" [(visible)]="displayDialog" [modal]="true" [style]="{width: '50vw'}">
      <div class="dialog-content-to-print">
        <h2>ข้อมูลลูกค้า</h2>
        <p>ชื่อ: {{ customer.name }}</p>
        <p>อีเมล: {{ customer.email }}</p>
      </div>

      <ng-template pTemplate="footer">
        <button pButton pButtonLabel="พิมพ์ข้อมูล" pButtonIcon="pi pi-print" (click)="printDialogContent()">Print
        </button>
        <button pButton pButtonLabel="ปิด" pButtonIcon="pi pi-times" (click)="displayDialog = false"
                class="p-button-secondary">Close
        </button>
      </ng-template>
    </p-dialog>
  `,
  styles: `
    /* styles.css หรือไฟล์ global styles อื่นๆ */

    @media print {
      /* ซ่อนทุกอย่างใน body ยกเว้น PrimeNG Dialog (และส่วนประกอบที่เกี่ยวข้อง) */
      /* เพิ่มสไตล์อื่นๆ สำหรับ element ภายในเนื้อหา dialog ถ้าจำเป็น */
      /* เช่น การกำหนด font-size หรือ margin สำหรับการพิมพ์ */

    }
  `
})
export class DialogPrintComponent {
  displayDialog: boolean = false;
  customer: any = {name: 'สมชาย', email: 'somchai@example.com'}; // ตัวอย่างข้อมูล

  constructor() {
  }


  showDialog() {
    this.displayDialog = true;
  }

  printDialogContent() {
    // เรียกคำสั่งพิมพ์ของเบราว์เซอร์
    window.print();
  }
}
