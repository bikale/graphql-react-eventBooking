const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');


const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    customer: {
      
    }
  }
});


// Mutations
const RootMutation = new GraphQLObjectType({
  name: 'Mutation'
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
});
