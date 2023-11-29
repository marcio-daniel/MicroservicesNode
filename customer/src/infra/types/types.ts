export type CreateCustomerRequest = {
  name: string;
  email: string;
  password: string;
  document: string;
};

export type Customer = {
  id?: string | undefined;
  name: string;
  email: string;
  password: string;
  document: string;
};

export type CustomerResponse = {
  id?: string | undefined;
  name: string;
  email: string;
};

export type KafkaCustomer = {
  id: string;
  name: string;
  email: string;
};
