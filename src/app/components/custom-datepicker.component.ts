import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateService } from '../services/date.service';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-custom-datepicker',
  imports: [SharedModule],
  template: `
    <div class="flex justify-center items-center gap-1.5 my-3">
      <p-treeSelect
        [options]="days"
        [formControl]="selectedDay" placeholder="วัน"
        (onNodeSelect)="onDayChange($event)"
      ></p-treeSelect>
      <p-treeSelect
        [options]="months"
        [formControl]="selectedMonth" placeholder="เดือน"
        (onNodeSelect)="onMonthChange($event)"></p-treeSelect>
      <p-treeSelect
        [options]="years"
        [formControl]="selectedYear" placeholder="ปี"
        (onNodeSelect)="onYearChange($event)"></p-treeSelect>
    </div>
    <div class="flex justify-center">
      @if (isShow()) {
        <p-message severity="error" icon="pi pi-times-circle" [life]="5000" styleClass="mb-2">
          <span class="text-indigo-300">{{ messages }}</span>
        </p-message>
      }
    </div>
  `,
  styles: ``
})
export class CustomDatepickerComponent implements OnInit {
  @Input() selectedYearInput: number | null = null; // รับค่าปีจาก Parent
  @Input() selectedMonthInput: number | null = null; // รับค่าเดือนจาก Parent
  @Output() dateSelected = new EventEmitter<{ year: number, month: number, day: number }>();

  years: { label: string, value: number }[] = [];
  months: { label: string; value: number }[] = [];
  days: { label: string, value: number }[] = Array.from({length: 31}, (_, i) => ({
    label: (i + 1).toString(),
    value: i + 1,
  }));

  selectedYear = new FormControl();
  selectedMonth = new FormControl();
  selectedDay = new FormControl();

  hasDay = 0;
  hasMonth = 0;
  hasYear = 0;
  monthName = '';
  messages = ''; // ใช้เก็บข้อความแจ้งเตือน
  isShow = signal(false);

  constructor(private dateService: DateService) {
    this.selectedYear.setValue(this.selectedYearInput);
    this.selectedMonth.setValue(this.selectedMonthInput);
    this.selectedDay.setValue(null);

    if (this.selectedYearInput) {
      this.selectedYear.setValue(this.selectedYearInput);
    }
    if (this.selectedMonthInput) {
      this.selectedMonth.setValue(this.selectedMonthInput);
      this.monthName = this.months[this.hasMonth - 1].label;
    }
  }

  ngOnInit() {
    this.years = this.dateService.getYears();
    this.months = this.dateService.getMonths();
  }

  onYearChange(event: any): void {
    console.log('Selected Year: ', event.node.value);
    this.hasYear = event.node.value;
    this.validDate();
  }

  onMonthChange(event: any): void {
    console.log('Selected Month: ', event.node.value);
    this.hasMonth = event.node.value;
    this.monthName = this.months[event.node.value - 1].label;
    this.validDate();
  }

  onDayChange(event: any) {
    console.log('Selected Day: ', event.node.value);
    this.hasDay = event.node.value;
    this.validDate();
  }

  validDate(): void {
    if (this.hasYear > 0 && this.hasMonth > 0 && this.hasDay > 0) {
      const maxDays = this.getMaxDays(this.hasYear, this.hasMonth);
      console.log('Max Days: ', maxDays);

      if (this.hasDay > maxDays) {
        this.isShow.set(true);
        this.messages = `เดือน: ${this.monthName} ${this.hasYear} มี ${maxDays} วันเท่านั้น`;
        this.selectedDay.setValue(null);
        this.selectedMonth.setValue(null);
        this.selectedYear.setValue(null);
      } else {
        this.isShow.set(false);
        this.messages = '';
        this.emitDate();
      }
    }
  }

  getMaxDays(year: number, month: number): number {
    const westernYear = year - 543;
    return new Date(westernYear, month, 0).getDate();
  }

  emitDate(): void {
    if (this.selectedYear.value && this.selectedMonth.value && this.hasDay) {
      this.dateSelected.emit({
        year: this.selectedYear.value,
        month: this.selectedMonth.value,
        day: this.hasDay,
        // day: this.days.find(day => day.value === this.hasDay)?.value || 0,
      });
    }
  }
}
