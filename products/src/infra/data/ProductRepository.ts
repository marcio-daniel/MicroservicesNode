import { PrismaClient } from "@prisma/client";
import { Product } from "../types/types";

export class ProductRepository {
  private _prismaClient: PrismaClient;

  constructor() {
    this._prismaClient = new PrismaClient();
  }

  public async createProduct(product: Product) {
    return await this._prismaClient.product.create({
      data: {
        ...product,
      },
    });
  }

  public async getProductByCode(code: string) {
    return await this._prismaClient.product.findFirst({
      where: {
        code: code,
      },
    });
  }

  public async updatedQuantity(productId: string, newQuantity: number) {
    return await this._prismaClient.product.update({
      where: {
        id: productId,
      },
      data: {
        quantity: newQuantity,
      },
    });
  }
}
