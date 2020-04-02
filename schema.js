const Event = require('./models/Event');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
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
    date: { type: new GraphQLNonNull(GraphQLString) }
  })
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    events: {
      type: new GraphQLList(eventType),
      resolve: () => {
        return Event.find()
          .then(result => result)
          .catch(err => console.log);
      }
    },
    findEvent: {
      // search event by all element or by the field inserted
      type: new GraphQLList(eventType),
      args: {
        _id: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        price: { type: GraphQLFloat },
        date: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        console.log(args);
        return Event.find(args)
          .then(result => result)
          .catch(err => console.log);
      }
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
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        price: { type: GraphQLFloat },
        date: { type: GraphQLString }
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
          date: new Date(args.date)
        });

        return event
          .save()
          .then(result => result)
          .catch(err => console.log);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
});
