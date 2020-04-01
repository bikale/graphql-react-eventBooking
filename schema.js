const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');

const user = [{ name: 'fre' }, { name: 'bikale' }, { name: 'mrx' }];

const eventType = new GraphQLObjectType({
  name: 'events',
  fields: {
    name: { type: GraphQLString }
  }
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    events: {
      type: new GraphQLList(eventType),
      resolve: () => user
    }
  }
});

// Mutations
const RootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    createEvent: {
      type: eventType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, args) {
        return args;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
});
