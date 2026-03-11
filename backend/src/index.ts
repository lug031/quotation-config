import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs } from "./graphql/schema";
import { buildResolvers } from "./graphql/resolvers";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: buildResolvers(),
});

const server = new ApolloServer({
  schema,
  includeStacktraceInErrorResponses: false,
});

const port = Number(process.env.PORT) || 4000;

async function main() {
  const { url } = await startStandaloneServer(server, { listen: { port } });
  console.log(`GraphQL server at ${url}`);
}

main();
