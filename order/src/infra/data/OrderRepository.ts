import { PrismaClient } from "@prisma/client";
import { CreateOrderRequest } from "../types/types";

export class OrderRepository {
  private _prismaClient: PrismaClient;

  constructor() {
    this._prismaClient = new PrismaClient();
  }

  public async create(request: CreateOrderRequest) {
    return await this._prismaClient.order.create({
      data: {
        customerId: request.customerId,
        orderItems: {
          createMany: {
            data: request.orderItems,
          },
        },
      },
    });
  }
}
