import { CustomerRepository } from "../infra/data/CustomerRepository";
import { Customer, CustomerConsumer } from "../infra/types/types";

export class CustomerServices {
  private _customerRepository: CustomerRepository;

  constructor() {
    this._customerRepository = new CustomerRepository();
  }

  public async create(data: CustomerConsumer) {
    const customer: Customer = {
      externalCustomerId: data.id,
      email: data.email,
      name: data.name,
    };
    const customerCreated = await this._customerRepository.createCustomer(
      customer
    );
    return customerCreated;
  }

}
