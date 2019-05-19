
var Joi = require('joi');

var modelRequestQueryParams = {
  query: {
    //sysparm_sys_id: Joi.string().empty(""),
    sysparm_fields: Joi.string().empty(""),   //.required(),
    sysparm_display_value: Joi.string().empty(""),
    sysparm_query: Joi.string().empty(""), //.required(),
    sysparm_groupby: Joi.string().empty(""),
    sysparm_order: Joi.string().empty(""),
    sysparm_limit: Joi.number().integer().empty(""),
    sysparm_offset: Joi.number().integer().empty("")       
  }
};

module.exports = {
  modelRequestQueryParams: modelRequestQueryParams
};
