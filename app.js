var express = require('express');
var app = express();
var path = require('path');
var helmet = require("helmet");
var bodyParser = require('body-parser');
var logger = require('./util/logger.util');
var errorUtil = require('./util/errorMessages.util');
var HTTP_CODES = require('./util/httpCodes.util');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//CORS support with OPTIONS
app.use(function (req, res, next) {
  var oneof = false;
  if (req.headers.origin) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    oneof = true;
  }
  if (req.headers['access-control-request-method']) {
    res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
    oneof = true;
  }
  if (req.headers['access-control-request-headers']) {
    res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
    oneof = true;
  }
  if (oneof) {
    res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
  }
  // intercept OPTIONS method
  if (oneof && req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

//Mount points
app.use('/', require('./routes/index.route'));
app.use('/v1', require('./routes/mainApp.route'));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handler
app.use(function (err, req, res, next) {
//err.isBoom => JOI validation error flag
  if (err.isBoom) {
    var error = {
      "code": HTTP_CODES.BAD_REQUEST,
      "errors": [
        {
          "domain": "Servers",
          "message": err.data[0].message.replace(/\"/g,'')
        }
      ],
      "message": "Enter a valid Query Parameter"
    };

    res.status(HTTP_CODES.BAD_REQUEST);
    res.json(error);
  } else if (err.status === 404) {
    var error = {
      "code": HTTP_CODES.NOT_FOUND,
      "errors": [
        {
          "domain": "Servers",
          "message": "Invalid Request"
        }
      ],
      "message": "Enter a valid Query or Path Parameter"
    };
    res.status(HTTP_CODES.NOT_FOUND)
    res.json(error);
  } else {
    var error = {
      "code": HTTP_CODES.INTERNAL_SERVER_ERROR,
      "errors": [
        {
          "domain": "s API",
          "message": err.code
        }
      ],
      "message": "Database Error"
    };
    logger.debug(err);    
    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR)
    res.json(error);
  }
});
module.exports = app;
