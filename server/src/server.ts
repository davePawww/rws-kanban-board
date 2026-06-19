import express from 'express';
import http from 'http';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express5';
import { schema } from './graphql/schema.ts';

const app = express();
const httpServer = http.createServer(app);

app.use(cors());
app.use(express.json());

const server = new ApolloServer({
  ...schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

export async function startServer() {
  await server.start();
  app.use('/graphql', expressMiddleware(server));
  return app;
}

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Kanban Board Service',
  });
});

export { app };
