const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');

const { } = require('./schema');

exports.createUser = {
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
};
