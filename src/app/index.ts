import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import express from "express";
import { User } from "./user";
import cors from "cors";
import { GraphqlContext } from "../interfaces";
import JWTService from "../services/jwt";

export const initServer = async () => {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  const server = new ApolloServer<GraphqlContext>({
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
  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const headers = req.headers.authorization;
        return {
          user: headers
            ? JWTService.decodeToken(headers.split("Bearer ")[1])
            : undefined,
        };
      },
    })
  );

  return app;
};
