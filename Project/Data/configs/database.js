const mongoose = require('mongoose');

mongoose.connect(process.env.USERS_MONGO_URI);