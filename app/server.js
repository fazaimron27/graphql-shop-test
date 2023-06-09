const fs = require("fs");
const path = require("path");

const { ApolloServer } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");

const { Query, Mutation } = require("./resolvers");
const { getUserId } = require("./utils");

const prisma = new PrismaClient();

const resolvers = {
  Query,
  Mutation,
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, "schema/schema.graphql"),
    "utf8"
  ),
  resolvers,
  context: ({ req }) => ({
    ...req,
    prisma,
    userId: req && req.headers.authorization ? getUserId(req) : null,
  }),
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
