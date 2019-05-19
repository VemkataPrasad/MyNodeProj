

var Joi = require('joi');


var responseSchema =Joi.object().keys({metaData: Joi.object().keys({count: Joi.number().integer(),
   limit: Joi.number().integer(), offset: Joi.number().integer()}), 
   result: Joi.array().items(Joi.object().keys({assetsCount: Joi.object().keys({appCount: Joi.number().integer(), 
    dbCount: Joi.number().integer()}), 
    serverName: Joi.string(), applicationNames: Joi.array().items(Joi.string().allow("")), dbNames: Joi.array()}))});


module.exports = {
  responseSchema:responseSchema
};
