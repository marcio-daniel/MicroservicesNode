import { Request, Response } from "express";
import { ProductsServices } from "../services/ProductsServices";

export class ProductController {
  private _productServices: ProductsServices;
  constructor() {
    this._productServices = new ProductsServices();
  }

  public async createProduct(data:any) {
    try {
      const product = await this._productServices.create(data.request);
      return product;
    } catch (error: any) {
      return { msg: error.message }
    }
  }
}
