import { Request, Response } from "express";
import { OrderServices } from "../services/OrderServices";

export class OrderController {
  private _orderServices: OrderServices;

  constructor() {
    this._orderServices = new OrderServices();
  }

  public async create(data:any) {
    try {
      const order = await this._orderServices.create(data.request);
      return order
    } catch (error: any) {
      return { msg: error.message };
    }
  }
}
