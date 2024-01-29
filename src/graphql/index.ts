import { ApolloServer } from "apollo-server-express";
import type { Application } from "apollo-server-express/node_modules/@types/express/index.d.ts";

import resolvers from "./resolvers";
import typeDefs from "./schemas";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export const useGraphQL = async (app: Application) => {
  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });
};
