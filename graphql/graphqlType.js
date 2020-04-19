const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');

//event type(graphql)
const eventType = new GraphQLObjectType({
  name: 'Event',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    price: { type: new GraphQLNonNull(GraphQLFloat) },
    date: { type: new GraphQLNonNull(GraphQLString) },
    creator: { type: userType },
  }),
});

//event type(graphql)
const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLString },
    createdEvents: { type: new GraphQLList(eventType) },
  }),
});

//event type(graphql)
const bookingType = new GraphQLObjectType({
  name: 'Booking',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLString) },
    event: { type: eventType },
    user: { type: userType },
    createdAt: { type: new GraphQLNonNull(GraphQLString) },
    updatedAt: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

//Auth type(graphql)
const authDataType = new GraphQLObjectType({
  name: 'AuthData',
  fields: () => ({
    userId: { type: new GraphQLNonNull(GraphQLString) },
    token: { type: new GraphQLNonNull(GraphQLString) },
    tokenExpiration: { type: GraphQLInt },
  }),
});

exports.userType = userType;
exports.eventType = eventType;
exports.bookingType = bookingType;
exports.authDataType = authDataType;
