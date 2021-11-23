const dotenv = require('dotenv')
const result = dotenv.config()
console.log("🚀 ~ file: main.js ~ line 3 ~ result", result)


const IS_PROD_ENV = process.env.NODE_ENV === 'production'
console.log("🚀 ~ file: server.js ~ line 4 ~ IS_PROD_ENV", process.env.NODE_ENV, IS_PROD_ENV)

if (IS_PROD_ENV) {
  if (result.error) {
    throw result.error
  }
}

const express = require('express');
const subsRouter = require('./routers/subscriptions')

const app = express();

require('./configs/database');

app.use(express.json());

app.use('/subscriptions', subsRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log('https Server listening on port: ' + PORT, { port: PORT, env: process.env.NODE_ENV });
});