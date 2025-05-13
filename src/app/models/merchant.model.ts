// models/merchant.model.ts (เหมือนเดิม)

export interface Address {
  district: string;
  homeStreet: string;
  province: string;
  subdistrict: string;
  zipCode: string; // หรือ string ถ้า zipCode เป็น string
}

export interface Merchant {
  companyName: string;
  phoneNumber: string;
  taxId: string;
  address: Address;
  id?: string;
  createdAt?: Date; // ใช้ 'any' หรือ Firestore Timestamp Type
  updatedAt?: Date; // ใช้ 'any' หรือ Firestore Timestamp Type
}
