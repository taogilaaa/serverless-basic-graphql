const { ApolloServer, gql } = require('apollo-server-lambda');

const typeDefs = gql`
  type Query {
    hello: String
    event: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    event: (_root, _args, context) => JSON.stringify(context),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: (receivedContext) => ({
    ...receivedContext,
  }),
});

// With workaround
exports.graphql = (event, lambdaContext, callback) => {
  // Playground handler
  if (event.httpMethod === 'GET') {
    server.createHandler()(
      {...event, path: event.requestContext.path || event.path},
      lambdaContext,
      callback,
    );
  } else {
    server.createHandler()(event, lambdaContext, callback);
  }
};

// Without the workaround
exports.defaultGraphql = server.createHandler();
