const Event = require('./models/Event');
const User = require('./models/User');
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

//event type(graphql)
const eventType = new GraphQLObjectType({
  name: 'Event',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    price: { type: new GraphQLNonNull(GraphQLFloat) },
    date: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

//event type(graphql)
const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    _id: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    events: {
      type: new GraphQLList(eventType),
      resolve: () => {
        return Event.find()
          .then((result) => result)
          .catch((err) => console.log);
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
      resolve(parentValue, args) {
        console.log(args);
        return Event.find(args)
          .then((result) => result)
          .catch((err) => console.log);
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
      resolve(parentValue, args) {
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

        const event = new Event({
          title: args.title,
          description: args.description,
          price: +args.price,
          date: new Date(args.date),
        });

        return event
          .save()
          .then((result) => result)
          .catch((err) => console.log);
      },
    },
    createUser: {
      type: userType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, args) {
        const user = new User({ email: args.email, password: args.password });

        return user
          .save()
          .then((res) => res)
          .catch((err) => console.log(err));
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
