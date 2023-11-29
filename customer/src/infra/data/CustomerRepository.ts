import { PrismaClient } from "@prisma/client";
import { Customer } from "../types/types";

export class CustomerRepository {
  private _prismaClient: PrismaClient;

  constructor() {
    this._prismaClient = new PrismaClient();
  }

  public async createCustomer(customer: Customer) {
    return await this._prismaClient.customer.create({
      data: {
        ...customer,
      },
    });
  }

  public async getCustomerByEmail(email: string) {
    return await this._prismaClient.customer.findFirst({
      where: {
        email: email,
      },
    });
  }

  public async getCustomerByDocument(document: string) {
    return await this._prismaClient.customer.findFirst({
      where: {
        document: document,
      },
    });
  }

  public async getCustomers() {
    return await this._prismaClient.customer.findMany();
  }
}
