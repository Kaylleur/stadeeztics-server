var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require('./mongo/database').connect();
var index = require('./routes/index');
var userRoutes = require('./routes/user');
var sessionRoutes = require('./routes/session');
var deezerRoutes = require('./routes/deezer');

var authenticator = require('./utils/authenticator');

var app = express();
app.set('env','development');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/**
 * Route to cover
 */
app.use('/user', authenticator);
app.use('/deezer', authenticator);

/**
 * Routing
 */
app.use('/', index);
app.use('/user', userRoutes);
app.use('/session', sessionRoutes);
app.use('/deezer', deezerRoutes);

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
  res.send(err);
});

module.exports = app;
