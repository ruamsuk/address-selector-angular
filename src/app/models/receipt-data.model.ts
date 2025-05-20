export interface CustomerData {
  name: string;
  address: string;
  subdistrict: string;
  district: string;
  province: string;
  zipCode: string;
  taxId: string;
  phone: string;
}

export interface ReceiptInfo {
  date: string; // หรือ Date
  bookNumber: string;
  receiptNumber: string;
}

export interface ReceiptItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface ReceiptData {
  customer: CustomerData;
  receiptInfo: ReceiptInfo;
  items: ReceiptItem[];
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
}

