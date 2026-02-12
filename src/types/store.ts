export interface Product {
  objectId: string;
  name: string;
  price: number; // in MIST
  stock: number;
  walrusBlobId?: string;
  imageUrl?: string;
  productId: number;
}

export interface DeliveryInfo {
  recipientName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  country: string;
  email: string;
  phone: string;
}

export interface Receipt {
  objectId: string;
  productName: string;
  productId: number;
  pricePaid: number;
  buyer: string;
  walrusBlobId?: string;
  imageUrl?: string;
  deliveryInfo?: DeliveryInfo;
  checkoutTimestamp: number;
}
