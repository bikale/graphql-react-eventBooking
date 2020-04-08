const bcrypt = require('bcryptjs');

const Event = require('../models/Event');
const User = require('../models/User');
const Booking = require('../models/Booking');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');

// Hardecoded data storage
// const events=[]

//find creator of the event by using the relation we build

const findCreator = async (userId) => {
  try {
    const creator = await User.findById(userId);
    return {
      ...creator._doc,
      createdEvents: eventCreated.bind(this, creator.createdEvents),
    };
  } catch (error) {
    throw error;
  }
};

//find events created by the user

const eventCreated = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
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
};
//find the single event created by the user
const findSingleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return {
      ...event._doc,
      _id: event.id,
      creator: findCreator.bind(this, event.creator),
    };
  } catch (err) {
    throw err;
  }
};

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

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
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

// Mutations
const RootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    createEvent: {
      type: eventType,
      args: {
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        price: { type: GraphQLFloat },
        date: { type: GraphQLString },
      },
      async resolve(parentValue, args) {
        //storing event info to array storage

        // const event = {
        //   _id: Math.random().toString(),
        //   title: args.title,
        //   description: args.description,
        //   price: +args.price,
        //   date: '12-12-1983'
        // };
        // events.push(event);
        // return event;

        //store event information to the cloud DB

        try {
          const event = new Event({
            title: args.title,
            description: args.description,
            price: +args.price,
            date: new Date(args.date),
            creator: '5e8c221ddf68b2410cbcc131',
          });
          let eventResult;
          const result = await event.save();
          eventResult = {
            ...result._doc,
            date: new Date(result._doc.date).toISOString(),
            creator: findCreator.bind(this, result._doc.creator),
          };
          const user = await User.findById('5e8c221ddf68b2410cbcc131');
          if (!user) {
            throw new Error('User doesnot exist');
          }
          user.createdEvents.push(event);
          await user.save();
          return eventResult;
        } catch (error) {
          throw error;
        }
      },
    },
    createUser: {
      type: userType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parentValue, args) {
        try {
          const user = await User.findOne({ email: args.email });

          if (user) {
            throw new Error('User exists alread');
          }
          const newuser = new User({
            email: args.email,
            password: args.password,
          });
          //hash password
          const salt = await bcrypt.genSalt(12);
          newuser.password = await bcrypt.hash(newuser.password, salt);
          const result = await newuser.save();
          return { ...result._doc, password: null };
        } catch (error) {
          throw error;
        }
      },
    },
    bookEvent: {
      type: bookingType,
      args: {
        eventId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parentValue, args) => {
        try {
          const createdEvent = await Event.findOne({ _id: args.eventId });
          const booking = new Booking({
            user: '5e8c221ddf68b2410cbcc131',
            event: createdEvent,
          });

          const result = await booking.save();
          return {
            ...result._doc,
            _id: result.id,
            user: findCreator.bind(this, booking._doc.user),
            event: findSingleEvent.bind(this, booking._doc.event),
            createdAt: new Date(result._doc.createdAt).toISOString(),
            updatedAt: new Date(result._doc.updatedAt).toISOString(),
          };
        } catch (error) {
          throw error;
        }
      },
    },
    cancelBooking: {
      type: eventType,
      args: {
        bookingId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parentValue, args) => {
        try {
          const booking = await Booking.findById(args.bookingId).populate(
            'event'
          );
          const event = {
            ...booking.event._doc,
            _id: booking.event.id,
            creator: findCreator.bind(this, booking.event._doc.creator),
          };
          await Booking.deleteOne({ _id: args.bookingId });
          return event;
        } catch (err) {
          throw err;
        }
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
