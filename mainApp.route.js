
var express = require('express');
var router = express.Router();
var expressJoi = require('express-joi-validator');
var requestSchema = require('../schemas/modelRequest.schema');
var responseSchema = require('../schemas/modelResponse.schema');
var mainService = require('../services/mainApp.service');
var crService = require('../services/changet.service');
var problemService = require('../services/problem.service');
var errorUtil = require('../util/errorMessages.util');
var HTTP_CODES = require('../util/httpCodes.util');
var logger = require('../util/logger.util');

router.get('/u_s/:sid',expressJoi(requestSchema.modelRequestQueryParams), function (req, res, next) {
  //console.log("sysparm_s_id" + req.params.s_id); 
  var queryObject = {
      "sysparm_s_id": req.params.s_id,
       "sysparm_fields": req.query.sysparm_fields,
       "sysparm_display_value": req.query.sysparm_display_value,
       "sysparm_query": req.query.sysparm_query,
       "sysparm_groupby": req.query.sysparm_groupby,
       "sysparm_order": req.query.sysparm_order,
       "sysparm_limit": req.query.sysparm_limit,
       "sysparm_offset": req.query.sysparm_offset       
    };     
      mainService.getTableResponse(queryObject, next, function (data) {        
        logger.debug('getsubexList Final results ');        
        res.json(data);        
      })
  });

  router.get('/u_subexp',expressJoi(requestSchema.modelRequestQueryParams), function (req, res, next) {
    //console.log("sysparm_s_id" + req.params.s_id); 
    var queryObject = {
        //"sysparm_s_id": req.params.s_id,
         "sysparm_fields": req.query.sysparm_fields,
         "sysparm_display_value": req.query.sysparm_display_value,
         "sysparm_query": req.query.sysparm_query,
         "sysparm_groupby": req.query.sysparm_groupby,
         "sysparm_order": req.query.sysparm_order,
         "sysparm_limit": req.query.sysparm_limit,
         "sysparm_offset": req.query.sysparm_offset       
      };     
        mainService.getTableResponse(queryObject, next, function (data) {        
          logger.debug('getsubexList Final results ');        
          res.json(data);
          // mainService.joiResValidation(data, responseSchema.serverSchema, function (response) {
          //   res.json(response);
          // })
        })
    });

  //change_request table route
  // router.get('/change_request/search',expressJoi(requestSchema.modelRequestQueryParams), function (req, res, next) {
  //   var queryObject = {
  //      "sysparm_fields": req.query.sysparm_fields,
  //      "sysparm_display_value": req.query.sysparm_display_value,
  //      "sysparm_query": req.query.sysparm_query,
  //      "sysparm_groupby": req.query.sysparm_groupby,
  //      "sysparm_order": req.query.sysparm_order,
  //      "sysparm_limit": req.query.sysparm_limit,
  //      "sysparm_offset": req.query.sysparm_offset       
  //   };     
  //   crService.getChangeRequestResponse(queryObject, next, function (data) {        
  //       logger.debug('getChangeRequestResponse Final results ');        
  //       res.json(data);        
  //     })
  // });

  // //Problem table route
  // router.get('/problem/search',expressJoi(requestSchema.modelRequestQueryParams), function (req, res, next) {
  //   var queryObject = {
  //      "sysparm_fields": req.query.sysparm_fields,
  //      "sysparm_display_value": req.query.sysparm_display_value,
  //      "sysparm_query": req.query.sysparm_query,
  //      "sysparm_groupby": req.query.sysparm_groupby,
  //      "sysparm_order": req.query.sysparm_order,
  //      "sysparm_limit": req.query.sysparm_limit,
  //      "sysparm_offset": req.query.sysparm_offset       
  //   };     
  //   problemService.getProblemResponse(queryObject, next, function (data) {        
  //       logger.debug('getProblemtResponse Final results ');        
  //       res.json(data);        
  //     })
  // });

module.exports = router;
