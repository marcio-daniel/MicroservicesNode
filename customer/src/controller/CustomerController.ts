import { Request, Response } from "express";
import { CustomerServices } from "../services/CustomerServices";

export class CustomerController {
  private _customerServices: CustomerServices;

  constructor() {
    this._customerServices = new CustomerServices();
  }

  public async createCustomer(data: any) {
    try {
      const customer = await this._customerServices.create(data.request);
      return customer;
    } catch (error: any) {
      return { msg: error.message }
    }
  }

}
