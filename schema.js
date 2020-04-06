const Event = require('./models/Event');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
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
    _id: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
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
          creator: '5e8ad39290ef9e475528e447',
        });
        let eventResult;
        return event
          .save()
          .then((result) => {
            eventResult = result;

            return User.findById('5e8ad39290ef9e475528e447')
              .then((user) => {
                if (!user) {
                  throw new Error('User doesnot exist');
                }
                user.createdEvents.push(event);
                return user.save();
              })
              .then((result) => {
                return eventResult;
              });
          })
          .catch((err) => console.log);
      },
    },
    createUser: {
      type: userType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parentValue, args) {
        return User.findOne({ email: args.email })
          .then(async (user) => {
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
          })
          .catch((err) => {
            throw err;
          });
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
