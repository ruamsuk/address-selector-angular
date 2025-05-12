import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { HeaderComponent } from './pages/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, HeaderComponent],
  template: `
    <p-toast/>
    <app-header/>


    <!--<p-treeSelect [(ngModel)]="selectedNode" [options]="treeData" placeholder="เลือกจังหวัด/อำเภอ/ตำบล"></p-treeSelect>
    <p>คุณเลือก: {{ selectedNode }}</p>-->

    <router-outlet/>
  `,
  styles: [],
})
export class AppComponent {
  title = 'print-receipt';

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
