const express = require('express');

const subsRouter=require('./routers/subscriptions')

let app = express();

require('./configs/database');

app.use(express.json());

app.use('/subscriptions', subsRouter);

app.listen(8000);