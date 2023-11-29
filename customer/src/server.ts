import { ApolloServer, gql } from "apollo-server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { CustomerController } from "./controller/CustomerController";

const PORT = process.env.PORT || 3010;

type Customer = {
  id: string;
  name: string;
  email: string;
};

type Msg = {
  msg: string;
};

const startServer = async () => {
  const typeDefs = gql`
    input CreateCustomerRequest {
      name: String!
      email: String!
      password: String!
      document: String!
    }

    type Customer {
      id: String!
      name: String!
      email: String!
    }

    type Msg {
      msg: String!
    }

    union CreateCustomerResult = Customer | Msg

    type Mutation {
      createCustomer(request: CreateCustomerRequest): CreateCustomerResult
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
      createCustomer: async (_, args) => {
        const response = (await new CustomerController().createCustomer(
          args
        )) as Customer | Msg;
        return response;
      },
    },
    CreateCustomerResult: {
      __resolveType: (obj) => {
        if (obj.msg) {
          return "Msg";
        } else if (obj.id) {
          return "Customer";
        }
      },
    },
  };

  const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
  });

  server.listen(PORT).then(() => {
    console.log(`🚀 Server ready`);
  });
};

startServer();
