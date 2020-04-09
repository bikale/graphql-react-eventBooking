const bcrypt = require('bcryptjs');

const Event = require('../models/Event');
const User = require('../models/User');
const Booking = require('../models/Booking');

const { eventCreated, findCreator, findSingleEvent } = require('./queryHelper');
const {
  bookingType,
  eventType,
  userType,
  authDataType,
} = require('./graphqlType');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    login: {
      type: authDataType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parentValue, args) => {
        try {
          const user = await User.findOne({ email: args.email });
          if (!user) {
            throw new Error('user does not exist');
          }
        } catch (error) {
          throw error;
        }
      },
    },
    events: {
      type: new GraphQLList(eventType),
      resolve: async () => {
        try {
          const events = await Event.find();

          return events.map((event) => {
            return {
              ...event._doc,
              date: new Date(event._doc.date).toISOString(),
              creator: findCreator.bind(this, event.creator),
            };
          });
        } catch (error) {
          throw error;
        }
      },
    },
    findEvent: {
      // search event by all element or by the field inserted
      type: new GraphQLList(eventType),
      args: {
        _id: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        price: { type: GraphQLFloat },
        date: { type: GraphQLString },
      },
      async resolve(parentValue, args) {
        try {
          console.log(args);
          const result = awaitEvent.find(args);
          return result;
        } catch (error) {
          throw error;
        }
      },
    },
    bookings: {
      type: new GraphQLList(bookingType),
      resolve: async () => {
        try {
          const bookings = await Booking.find();
          return bookings.map((booking) => {
            return {
              ...booking._doc,
              _id: booking.id,
              user: findCreator.bind(this, booking._doc.user),
              event: findSingleEvent.bind(this, booking._doc.event),
              createdAt: new Date(booking._doc.createdAt).toISOString(),
              updatedAt: new Date(booking._doc.updatedAt).toISOString(),
            };
          });
        } catch (error) {
          throw error;
        }
      },
    },
  },
});
module.exports = RootQuery;
