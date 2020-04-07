const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const schema = require('./graphql/schema.js');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

// Graphql server
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true
  })
);

const PORT = process.env.PORT || 5000;

//Connect DB
mongoose
  .connect(process.env.MongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log(`MongoDB Connected ........`);
    app.listen(PORT, () => {
      console.log(`Server running.... http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.log(err);
  });
