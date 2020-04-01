const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema.js');


const app = express();
app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true
  })
);



app.listen(3000, () => {
  console.log('Server running.... http://localhost:3000');
});
