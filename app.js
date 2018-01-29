const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')

/* API routes */
const users = require('./server/routes/users');
const employees = require('./server/routes/employees')

/* Database setup */
const config = require('./server/config/config')
// connect the database
mongoose.connect(config.url)
// check if the database is running
mongoose.connection.on('connected', () => {
  console.log('Database connected')
})
mongoose.connection.on('error', () => {
  console.error('Database connection error. Make sure your database is running')
})

const app = express();

/* Configure passport */
require('./server/config/passport')(passport)

/*
 * uncomment for setting up server side view rendering
 */

// // view engine setup
// app.set('views', path.join(__dirname, 'server/views'));
// app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* required for passport */
app.use(session({
  secret: 'some secret key',
  saveUninitialized: true,
  resave: true
}))
app.use(passport.initialize())
app.use(passport.session())

/* the api entry point */
app.use('/api/v1/', employees)
app.use('/api/', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
