import { CustomerRepository } from "../infra/data/CustomerRepository";
import { KafkaProducer } from "../infra/kafka/producer/producer";
import {
  CreateCustomerRequest,
  Customer,
  CustomerResponse,
  KafkaCustomer,
} from "../infra/types/types";

export class CustomerServices {
  private _customerRepository: CustomerRepository;

  constructor() {
    this._customerRepository = new CustomerRepository();
  }

  public async create(data: CreateCustomerRequest) {
    if (
      (await this._customerRepository.getCustomerByEmail(data.email)) ||
      (await this._customerRepository.getCustomerByDocument(data.document))
    ) {
      throw new Error("Customer already exists!");
    }
    const customer: Customer = data;
    const customerCreated = await this._customerRepository.createCustomer(
      customer
    );
    const kafkaProducer = new KafkaProducer();
    const kafkaCustomer: KafkaCustomer = {
      id: customerCreated.id!,
      name: customer.name,
      email: customer.email,
    };
    await kafkaProducer.sendMessage("CUSTOMER_CREATED", kafkaCustomer);
    const response = {
      id: customerCreated.id!,
      name: customer.name,
      email: customer.email,
    };
    return response;
  }
}
