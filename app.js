const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const graphqlHTTP = require('express-graphql');

const schema = require('./graphql/schema.js');
const isAuth = require('./middleware/isAuth');

const app = express();

app.use(bodyParser.json());

//allow cross origin access
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
//fre
//fre
//i h u 
//authentication middleware
app.use(isAuth);

// Graphql server
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

const PORT = process.env.PORT || 5000;

//Connect mongoDB
mongoose
  .connect(process.env.MongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`MongoDB Connected ........`);
    app.listen(PORT, () => {
      console.log(`Server running.... http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
