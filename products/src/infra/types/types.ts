export type ProductCreateRequest = {
  name: string;
  code: string;
  quantity: number;
  price: number;
};

export type KafkaProduct = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

export type ProductConsumer = {
  id: string;
  newQuantity: number;
};

export type Product = {
  id?: string | undefined;
  name: string;
  code: string;
  quantity: number;
  price: number;
};
