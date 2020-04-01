const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp= require('express-graphql')
const app = express();

app.use(bodyParser.json());

app.listen(3000, () => {
  console.log('Server running.... http://localhost:3000');
});
