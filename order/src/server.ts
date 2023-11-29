import "./infra/kafka/consumer/";
import { ApolloServer, gql } from "apollo-server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { OrderController } from "./controller/OrderController";
import { GraphQLDate } from "graphql-scalars";

const PORT = process.env.PORT || 3011;

type Order = {
  id: string;
  createdAt: Date;
  customerId: string;
};

type Msg = {
  msg: string;
};

const startServer = async () => {
  const typeDefs = gql`
    scalar Date

    input OrderItem {
      quantity: Int!
      productId: String!
    }

    input CreateOrderRequest {
      customerId: String!
      orderItems: [OrderItem]
    }

    type Order {
      id: String!
      createdAt: Date
      customerId: String!
    }

    type Msg {
      msg: String!
    }

    union CreateOrderResult = Order | Msg

    type Mutation {
      createOrder(request: CreateOrderRequest): CreateOrderResult
    }

    type Query {
      hello: String!
    }
  `;

  const resolvers = {
    Query: {
      hello: () => {
        return "Hello";
      },
    },
    Mutation: {
      createOrder: async (_, args) => {
        const response = (await new OrderController().create(args)) as
          | Order
          | Msg;
        return response;
      },
    },
    CreateOrderResult: {
      __resolveType: (obj) => {
        if (obj.msg) {
          return "Msg";
        } else if (obj.id) {
          return "Order";
        }
      },
    },
    Date: GraphQLDate,
  };

  const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
  });

  server.listen(PORT).then(() => {
    console.log(`🚀 Server ready `);
  });
};

startServer();
