/**
 * Cloud SQL Configuration
 
 */

var sequalize = require('sequelize');
var logger = require('../util/logger.util');
var fs = require("fs");
var errorUtil = require('../util/errorMessages.util');
const mysql = require('mysql');
const config = require('../config/config');

const options = {
  connectionLimit : 10,
  user: config.get('MYSQL_USER'),
  password: config.get('MYSQL_PASSWORD'),
  //host: config.get('MYSQL_HOST'),
  //port: config.get('MYSQL_PORT'),
  database: config.get('MYSQL_DATABASE')
};


logger.debug("Check of instance name"+config.get('INSTANCE_CONNECTION_NAME'));
if (config.get('INSTANCE_CONNECTION_NAME') && config.get('NODE_ENV') === 'production') {
  options.socketPath = `/cloudsql/${config.get('INSTANCE_CONNECTION_NAME')}`;
}
const pool  = mysql.createPool(options);
pool.getConnection(function(err, connection) {
  if (err) {
    logger.error('error connecting: ' + err.stack);
    return;
  }
  logger.debug('connected as id ' + connection.threadId);
  console.log('connected as id ' + connection.threadId)
});

module.exports = pool;
