import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  orderBy,
  query,
  updateDoc
} from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { Merchant } from '../models/merchant.model';

@Injectable({
  providedIn: 'root'
})
export class ReceiptDataService {
  firestore = inject(Firestore);

  constructor() {
  }

  getMerchantData() {
    const dbInstance = collection(this.firestore, 'merchant');
    const q = query(dbInstance, orderBy('createdAt', 'desc'));

    return collectionData(q, {idField: 'id'}) as Observable<Merchant[]>;
  }

  addMerchantData(merchant: Merchant) {
    const dbInstance = collection(this.firestore, 'merchant');
    const addedMerchant = {
      ...merchant,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return from(addDoc(dbInstance, addedMerchant));
  }

  updateMerchantData(merchant: Merchant) {
    const dbRef = doc(this.firestore, 'merchant', `${merchant.id}`);
    const updatedMerchant = {
      ...merchant,
      updatedAt: new Date(),
    };
    return from(updateDoc(dbRef, updatedMerchant));
  }

  deleteMerchantData(merchant: Merchant) {
    const dbRef = doc(this.firestore, 'merchant', `${merchant.id}`);
    return from(deleteDoc(dbRef));
  }
}
