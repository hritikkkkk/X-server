import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import express from "express";
import { User } from "./user";
import cors from "cors"

export const initServer = async () => {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  const server = new ApolloServer({
    typeDefs: ` ${User.types}
    type Query {
            ${User.queries}
        }
    `,

    resolvers: {
      Query: {
        ...User.resolvers.queries,
      },
    },
  });
  await server.start();
  app.use("/graphql", express.json(), expressMiddleware(server));

  return app;
};
