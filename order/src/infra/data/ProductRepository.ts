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

  public async getProductById(productId: string) {
    return await this._prismaClient.product.findFirst({
      where: {
        id: productId,
      },
    });
  }

  public async updateQuantity(product: Product) {
    return await this._prismaClient.product.update({
      where: {
        id: product.id,
      },
      data: {
        quantity: product.quantity,
      },
    });
  }
}
