import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import { Observable } from 'rxjs';
import { HeaderComponent } from './pages/header.component';
import { SharedModule } from './shared/shared.module';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SharedModule, HeaderComponent],
  template: `
    <p-toast/>
    <p-confirmdialog></p-confirmdialog>
    <app-header/>


    <!--<p-treeSelect [(ngModel)]="selectedNode" [options]="treeData" placeholder="เลือกจังหวัด/อำเภอ/ตำบล"></p-treeSelect>
    <p>คุณเลือก: {{ selectedNode }}</p>-->

    <router-outlet/>
  `,
  styles: [],
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    this.getTranslations()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((translations) => {
        this.primeng.setTranslation(translations);
      });
  }

  private primeng: PrimeNG = inject(PrimeNG);
  private destroyRef: DestroyRef = inject(DestroyRef);


  constructor(private http: HttpClient) {
  }

  getTranslations(): Observable<any> {
    return this.http.get<any>('/assets/i18n/th.json');
  }

  /** * Sample code for a simple Angular component that uses a dropdown to select provinces, districts, and subdistricts.

   import { Component, OnInit } from '@angular/core';
   import { HttpClient } from '@angular/common/http';

   interface TreeNode {
   label?: string;
   value?: string;
   children?: TreeNode[];
   }

   @Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
    })
    export class AppComponent implements OnInit {
    treeData: TreeNode[] = [];
    selectedNode: any;

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
    this.http.get('/assets/th_amphures.json').subscribe(data => {
    this.treeData = data as TreeNode[];
    });
    }
    }
    -- end of sample * */
}
