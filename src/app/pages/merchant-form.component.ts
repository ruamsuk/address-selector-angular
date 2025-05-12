import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-merchant-form',
  imports: [SharedModule],
  template: `
    <div class="flex justify-center items-center mt-2 md:mt-16">
      <div class="card w-full max-w-4xl">
        <h2 class="text-center text-2xl font-bold mb-4">Merchant Form</h2>
        <p-card>
          <ng-template #header>
            <h3 class="text-lg font-semibold">Merchant Information</h3>
          </ng-template>
          <form class="merchant-form">
            <!-- Add your form fields here -->
            <div class="field">
              <input id="merchantName" type="text" placeholder="Merchant Name"/>
            </div>
            <div class="field my-4">
              <input id="merchantAddress" type="text" placeholder="Merchant Address"/>
            </div>
            <div class="field">
              <input id="merchantPhone" type="text" placeholder="Merchant Phone number"/>
            </div>
            <div class="field my-4">
              <input id="merchantEmail" type="email" placeholder="Merchant Email"/>
            </div>
            <!-- Add more fields as needed -->
            <div class="flex justify-center">
              <button type="submit"
                      pButton severity="primary"
                      class="mt-4">
                <span pButtonLabel>Submit</span>
              </button>
            </div>


          </form>
        </p-card>
      </div>
    </div>
  `,
  styles: ``
})
export class MerchantFormComponent {

}
