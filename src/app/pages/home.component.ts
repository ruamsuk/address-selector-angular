import { Component, inject, OnInit } from '@angular/core';
// import { FormControl, FormGroup } from '@angular/forms';
import { AddressService } from '../services/address.service';
import { SharedModule } from '../shared/shared.module';

interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'app-home',
  imports: [SharedModule],
  template: `
    <!--<form [formGroup]="formGroup" class="card flex justify-center my-5">
      <p-select
        formControlName="selectedCity"
        [options]="cities"
        (onChange)="onCityChange($event)"
        optionLabel="name"
        placeholder="Select a City"
        class="w-full md:w-56"/>
    </form>-->
  `,
  styles: ``
})
export class HomeComponent implements OnInit {
  addressService = inject(AddressService);
  // cities: City[] | undefined;
  //
  // formGroup: FormGroup = new FormGroup({
  //   selectedCity: new FormControl<City | null>(null)
  // });

  ngOnInit(): void {
    // this.cities = [
    //   {name: 'New York', code: 'NY'},
    //   {name: 'Rome', code: 'RM'},
    //   {name: 'London', code: 'LDN'},
    //   {name: 'Istanbul', code: 'IST'},
    //   {name: 'Paris', code: 'PRS'}
    // ];
  }

  // onCityChange($event: any) {
  //   console.log('Selected City: ', JSON.stringify($event, null, 2));
  // }
}
