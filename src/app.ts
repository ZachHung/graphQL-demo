import { ApolloServer } from 'apollo-server-express';
import * as dotenv from 'dotenv';
import { buildSchema } from 'type-graphql';
import { AppDataSource } from './config/data-source';
import logger from './config/logger';
import express, { Request } from 'express';
import cors from 'cors';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginDrainHttpServer,
} from 'apollo-server-core';
import { getEnv } from './utils/get-env';
import { Context } from './core/types/context.interface';
import { CustomAuthChecker } from './core/auth-checker';
import { ErrorLoggerMiddleware } from './core/error.interceptor';
import { User } from './modules/user/user.entity';
import http from 'http';

dotenv.config();

export const bootstrap = async (): Promise<void> => {
  const app = express();
  const httpServer = http.createServer(app);
  await AppDataSource.initialize();
  app.use(cors());
  const schema = await buildSchema({
    resolvers: [__dirname + '/modules/**/*.resolver.{ts,js}'],
    globalMiddlewares: [ErrorLoggerMiddleware],
    authChecker: CustomAuthChecker,
  });

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: 'bounded',
    context: ({ req }): Context => {
      return {
        req: req,
        user: (req as Request & { user?: User }).user,
      };
    },
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
      ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
  });
  await server.start();
  server.applyMiddleware({ app });
  httpServer.listen(+getEnv('PORT'), () =>
    logger.info(
      `Server running in ${getEnv('NODE_ENV')} mode at http://localhost:${getEnv('PORT')}${
        server.graphqlPath
      }`,
    ),
  );
};
