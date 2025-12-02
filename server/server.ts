import { ApolloServer } from '@apollo/server';
import { expressMiddleware as apolloMiddleware } from '@as-integrations/express5';
import cors from 'cors';
import express from 'express';
import { readFile } from 'node:fs/promises';
import { resolvers } from './src/graphql/resolvers/index.ts';
import { authMiddleware, handleLogin } from './src/auth.ts';
import { WebSocketServer } from 'ws';
import { createServer as createHttpServer } from 'node:http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { useServer as useWsServer } from 'graphql-ws/use/ws';
import { getHttpContext } from './src/utils/getHttpContext.ts';
import { getWsContext } from './src/utils/getWsContext.ts';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env['PORT'] || 9000;

const app = express();
app.use(cors(), express.json());

app.post('/login', handleLogin);

// function getHttpContext({ req }) {
//   if (req.auth) {
//     return { user: req.auth.sub };
//   }
//   return {};
// }

// function getWsContext({ connectionParams }) {
//   const accessToken = connectionParams?.accessToken;
//   if (accessToken) {
//     const payload = decodeToken(accessToken);
//     return { user: payload.sub };
//   }
//   return {};
// }

const typeDefs = await readFile('src/graphql/schema.graphql', 'utf8');
const schema = makeExecutableSchema({ typeDefs, resolvers });

const apolloServer = new ApolloServer({ schema });
await apolloServer.start();
app.use(
  '/graphql',
  authMiddleware,
  apolloMiddleware(apolloServer, {
    context: getHttpContext,
  }),
);

const httpServer = createHttpServer(app);
const wsServer = new WebSocketServer({ server: httpServer, path: '/graphql' });
useWsServer({ schema, context: getWsContext }, wsServer);

httpServer.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
