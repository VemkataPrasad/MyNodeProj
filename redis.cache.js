/**
 * Redis Connection
 * @author Prasad Balla


var redis = require('redis');
var logger = require('../util/logger.util');
var errorUtil = require('../util/errorMessages.util');

var config;
if(process.env.REDIS_HOST) {
  config = {};
  config.host = process.env.REDIS_HOST;
  config.port = process.env.REDIS_PORT ;
} else {
  var localconfig = require('config.json')('./config/config.json');
  config = localconfig.redis;
}

var redisClient = redis.createClient({host: config.host, port: config.port});

redisClient.on('connect', function () {
  logger.info('Redis connection successful.');
});

redisClient.on('error', function (err) {
  logger.error(errorUtil.buildErrorMessageDev(err));
});


module.exports = redisClient;
 */
