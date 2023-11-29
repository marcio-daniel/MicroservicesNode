import { ApolloServer } from 'apollo-server-express';
import { ApolloGateway } from '@apollo/gateway';
import express from 'express';

const startApolloServer = async () => {
    const app = express();

    const gateway = new ApolloGateway({
        serviceList: [
            { name: 'customer', url: 'http://localhost:3010/' },
            { name: 'product', url: 'http://localhost:3012/' },
            { name: 'order', url: 'http://localhost:3011/' },

        ]
    });

    const server = new ApolloServer({
        gateway,
    });

    await server.start();

    server.applyMiddleware({ app })

    const PORT = 5500;
    app.listen(PORT, () => {
        console.log(`API GATEWAY RUNNING IN http://localhost:${PORT}${server.graphqlPath}`)
    })
}
startApolloServer();
