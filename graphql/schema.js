const bcrypt = require('bcryptjs');

const RootQuery = require('./query');
const RootMutation = require('./mutation');

const { GraphQLSchema } = require('graphql');


module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
