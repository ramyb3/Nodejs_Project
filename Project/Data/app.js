const dotenv = require('dotenv')
const result = dotenv.config()
console.log("🚀 ~ file: main.js ~ line 3 ~ result", result)


const IS_PROD_ENV = process.env.NODE_ENV === 'production'
console.log("🚀 ~ file: server.js ~ line 4 ~ IS_PROD_ENV", process.env.NODE_ENV, IS_PROD_ENV)

if (!IS_PROD_ENV) {
  if (result.error) {
    throw result.error
  }
}

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const session = require('express-session');

// var indexRouter = require('./routes/index');
var usersRouter = require('./routes/login');

var app = express();

app.use(session({ secret: process.env.SESSION_SECRET }));

require('./configs/database');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// module.exports = app;

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log('https Server listening on port: ' + PORT, { port: PORT, env: process.env.NODE_ENV });
});

