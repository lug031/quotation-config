import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { GraphQLError } from "graphql";
import { typeDefs } from "./graphql/schema";
import { buildResolvers } from "./graphql/resolvers";
import { logger } from "./logger";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: buildResolvers(),
});

const GENERIC_ERROR_MESSAGE = "Ha ocurrido un error. Inténtelo de nuevo.";

const server = new ApolloServer({
  schema,
  includeStacktraceInErrorResponses: false,
  formatError(formattedError, error) {
    const original = error ?? formattedError;
    if (original instanceof GraphQLError && original.extensions?.code === "BAD_USER_INPUT") {
      return { message: formattedError.message };
    }
    logger.error("GraphQL error", {
      message: original instanceof Error ? original.message : String(original),
    });
    return { message: GENERIC_ERROR_MESSAGE };
  },
});

const port = Number(process.env.PORT) || 4000;

async function main() {
  await startStandaloneServer(server, { listen: { port } });
  logger.info("Server started", { port });
}

main();
