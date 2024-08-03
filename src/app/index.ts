import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import express from "express";
import { User } from "./user";
import { Tweet } from "./tweet";
import cors from "cors";
import { GraphqlContext } from "../interfaces";
import JWTService from "../services/jwt";

export const initServer = async () => {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  const server = new ApolloServer<GraphqlContext>({
    typeDefs: ` ${User.types}    ${Tweet.types}
    type Query {
            ${User.queries}
            ${Tweet.queries}
       }
      type Mutation {
          ${Tweet.mutations}
          ${User.mutations}
        }
    `,

    resolvers: {
      Query: {
        ...User.resolvers.queries,
        ...Tweet.resolvers.queries,
      },
      Mutation: {
        ...Tweet.resolvers.mutations,
        ...User.resolvers.mutations,
      },
      ...Tweet.resolvers.extraResolvers,
      ...User.resolvers.extraResolvers,
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
