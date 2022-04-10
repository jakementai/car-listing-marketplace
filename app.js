var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const parser = require('body-parser');
var indexRouter = require('./routes/index');
const authMiddleware = require('./controllers/auth');
const { promisify } = require('util');

// Express app
var app = express();
const PORT = process.env.PORT || 3000

//App Routes
app.use(parser.json());
app.use(parser.urlencoded({ extended: true}))

//Authenticate with OAuth
app.use(authMiddleware);

//Proceed to API Routes
app.use('/', indexRouter);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


module.exports = app;


//Start listening
const startServer = async () => {
  await promisify(app.listen).bind(app)(PORT)
  console.log(`Listening on port ${PORT}`)
}

startServer();

