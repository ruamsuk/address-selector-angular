import { NgOptimizedImage } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-header',
  imports: [SharedModule, NgOptimizedImage, RouterLink],
  template: `
    <div class="mx-1 navbar-print">
      <p-toolbar styleClass="shadow-md"
                 [style]="{ 'border-radius': '2rem', 'padding': '1rem 1rem 1rem 1.5rem' }">
        <ng-template #start>
          <div class="flex items-center gap-2 cursor-pointer">
            <img
              ngSrc="/images/primeng-logo.png"
              alt="logo"
              height="43"
              width="40" priority routerLink="/">
          </div>
        </ng-template>
        <ng-template #center>
          <div class="flex items-center gap-2">
            <p-button label="สร้างใบเสร็จ" routerLink="/new-receipt" variant="text"/>
            <p-button label="ตั้งค่าผู้ขาย" routerLink="/merchant-form" variant="text"/>
            <p-button label="View" variant="text"/>
          </div>
        </ng-template>
        <ng-template #end>
          <div class="flex items-center px-2">
            <p-button
              (onClick)="toggleDarkMode()"
              [icon]="isDarkMode() ? 'pi pi-moon' : 'pi pi-sun'"
              severity="secondary"/>
          </div>
        </ng-template>
      </p-toolbar>
    </div>
  `,
  styles: ``
})
export class HeaderComponent {
  isDarkMode = signal(this.getInitialDarkMode());

  toggleDarkMode() {
    const element = document.querySelector('html');
    if (element) {
      element.classList.toggle('my-app-dark');
      const newMode = !this.isDarkMode();
      this.isDarkMode.set(newMode);
      localStorage.setItem('darkMode', JSON.stringify(newMode));
    }
  }

  private getInitialDarkMode(): boolean {
    const storedMode = localStorage.getItem('darkMode');
    if (storedMode !== null) {
      const isDark = JSON.parse(storedMode);
      const element = document.querySelector('html');
      if (isDark && element) {
        element.classList.add('my-app-dark');
      }
      return isDark;
    }
    return false;
  }

}
