const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');

const user = [{ name: 'fre' }, { name: 'bikale' }, { name: 'mrx' }];
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    events: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: 'events',
          fields: {
            name: { type: GraphQLString }
          }
        })
      ),
      resolve: () => user
    }
  }
});

// Mutations
const RootMutation = new GraphQLObjectType({
  name: 'Mutation'
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
