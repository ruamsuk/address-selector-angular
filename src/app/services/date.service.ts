import { Injectable } from '@angular/core';
import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';


@Injectable({
  providedIn: 'root'
})
export class DateService {

  getYears() {
    const currentYear = dayjs().year() + 543; // Convert to Buddhist Era
    // return Array.from({length: currentYear - min + 1}, (_, i) => {
    //   const year = min + i;
    return Array.from({length: 100}, (_, i) => {
      const year = currentYear - i;
      return {
        label: `${year}`,
        value: year
      };
    });
  }

  getMonths(): { label: string, value: number }[] {
    return [
      {label: 'มกราคม', value: 1},
      {label: 'กุมภาพันธ์', value: 2},
      {label: 'มีนาคม', value: 3},
      {label: 'เมษายน', value: 4},
      {label: 'พฤษภาคม', value: 5},
      {label: 'มิถุนายน', value: 6},
      {label: 'กรกฎาคม', value: 7},
      {label: 'สิงหาคม', value: 8},
      {label: 'กันยายน', value: 9},
      {label: 'ตุลาคม', value: 10},
      {label: 'พฤศจิกายน', value: 11},
      {label: 'ธันวาคม', value: 12},
    ];
  }

  getDays(year: number, month: number): number[] {
    const westernYear = year - 543; // Convert from Buddhist Era to Gregorian

    /** Check if the year is a leap year */
    dayjs.extend(isLeapYear);

    /** Determine the number of days in the month */
    let daysInMonth: number;
    if (month === 2) {
      daysInMonth = dayjs(`${westernYear}-${month + 1}`).isLeapYear() ? 29 : 28;
    } else {
      daysInMonth = [4, 6, 9, 11].includes(month) ? 30 : 31;
    }
    /** Generate an array of days for the given month */
    return Array.from({length: daysInMonth}, (_, i) => i + 1);
  }
}
