var winston = require('winston');
winston.emitErrs = true;

var loggerLevel = process.env.LOGGER_LEVEL || "debug";

var logger = new( winston.Logger )( {
  transports: [
    new winston.transports.Console( {
      level: loggerLevel,
      colorize: false,
      json:false
    } )
  ]
} );

module.exports = logger;

