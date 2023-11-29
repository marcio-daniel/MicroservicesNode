export type Customer = {
  id?: string | undefined;
  externalCustomerId: string;
  name: string;
  email: string;
};

export type CreateOrderRequest = {
  customerId: string;
  orderItems: [
    {
      quantity: number;
      productId: string;
    }
  ];
};

export type CustomerConsumer = {
  id: string;
  name: string;
  email: string;
};
export type Product = {
  id?: string | undefined;
  externalProductId: string;
  name: string;
  quantity: number;
  price: number;
};

export type OrderResponse = {
  id: string;
  customerId: string;
};

export type ProductConsumer = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};
