import { ApolloServer, gql } from "apollo-server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { ProductController } from "./controller/ProductController";

const PORT = process.env.PORT || 3012;
import "./infra/kafka/consumer";

type Product = {
  id: string;
  name: string;
  code: string;
  quantity: number;
  price: number;
};

type Msg = {
  msg: string;
};

const startServer = async () => {
  const typeDefs = gql`

    input CreateProductRequest {
        name: String!
        code: String!
        quantity: Int!
        price: Float!
    }

    type Product {
        id: String!
        name: String!
        code: String!
        quantity: Int!
        price: Float!
    }

    type Msg {
      msg: String!
    }

    union CreateProductResult = Product | Msg

    type Mutation {
      createProduct(request: CreateProductRequest): CreateProductResult
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
      createProduct: async (_, args) => {
        const response = (await new ProductController().createProduct(args)) as
          | Product
          | Msg;
        return response;
      },
    },
    CreateProductResult: {
      __resolveType: (obj) => {
        if (obj.msg) {
          return "Msg";
        } else if (obj.id) {
          return "Product";
        }
      },
    },
  };

  const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
  });

  server.listen(PORT).then(() => {
    console.log(`🚀 Server ready `);
  });
};

startServer();
