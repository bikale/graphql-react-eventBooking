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


const {eventCreated,findCreator,findSingleEvent} = require('./queryHelper')
const {bookingType,eventType,userType} = require('./graphqlType')

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
  module.exports = RootMutation

