/**
 * SUBEXPERIENCE Service
 * @author VXB8577
 */

var Connection = require('../db/cloudSQL.db');
var redisConnection = require('../cache/redis.cache');
var logger = require('../util/logger.util');
var sortJsonArray = require('sort-json-array');
var Joi = require('joi');
var S = require('string');
/**
 * Get SubexperienceList
 * @param queryObject DB Query parameter(s)
 */

var getProblemResponse = function (queryObject,next,callback) {
  getProblemResponseData(queryObject,next,function (data) {   
    
    var meta = {
      "count": data.length,
      "limit": queryObject.sysparm_limit || 100,
      "offset": queryObject.sysparm_offset || 0
    }

    var finalArr={"metaData": meta,
      "result":  data }
      callback(finalArr);
  })
};

/**
 * Get Subexperience Data
 * * @param queryObject queryObject DB Query parameter(s)
 */

var getProblemResponseData = function (queryObject,next,callback) {
  logger.debug("Entered into getProblemResponseData method");

  validateProblemFields(queryObject, next, function (validationReslts) {
    
    if (validationReslts.isValidFields === true) 
    {      
      getProblemResponseFromDB(queryObject,next,function (data) {
        callback(data);    
      });
    } else {      
      callback(validationReslts);
    }         
    
  });

}

/**
 * Validate query params and make sure if all fields are valid
 * @param finalQuery  Query parameter(s)
 */
 var validateProblemFields = function(queryObject, next, callback) {
  logger.debug("Entered into validateProblemFields method");
  

  var syspfields = queryObject.sysparm_fields;
  var  fields = S(syspfields).split(',');
 

      var validationResults = {
        "errorMessage": "",
        "isValidFields" : true,
        "invalidFields": [],        
        "invalidOrderByFields": []
      };

      //All Allowed Problem Fields
      var allowedFields = [      'variables','watch_list','wf_activity','work_end','work_notes','work_start'
      ];
      
      //console.log(fields.length);      
      for(var j = 0; j<fields.length; j++){
        
            if(allowedFields.indexOf(fields[j])<0) {  
              validationResults.errorMessage = "Invalid sys_Param fields.Please check below list of invalid Fields.";          
              validationResults.isValidFields = "false";
              validationResults.invalidFields.push(fields[j]);                                                            
          }      
          }        
          

      if (queryObject.sysparm_order) {
        var orderByClause =  queryObject.sysparm_order;
        var orderByArray = S(orderByClause).split(',');            
              for(var j = 0; j<orderByArray.length; j++){               
                    if(allowedFields.indexOf(orderByArray[j])<0) {  
                      validationResults.errorMessage = "Invalid fields.Please check below list of invalid Fields.";          
                      validationResults.isValidFields = "false";
                      validationResults.invalidOrderByFields.push(orderByArray[j]);                                                            
                  }
                }
        }                    
      callback(validationResults);      
    
}

 /**
 * Build dynamic query based on parameters passed and get the results
 * @param finalQuery  Query parameter(s)
 */

 var getProblemResponseFromDB = function (queryObject,next, callback) {
  
  logger.debug("Entered into getProblemResponseFromDB method");
  var me = this;
  var sysparm_query =  queryObject.sysparm_query;  
  var sysparmFields = queryObject.sysparm_fields;
  var sysparmFieldsAry = S(sysparmFields).split(',');  

  me.dvListArray = ['rfc','u_caused_by_change_id','u_contact_name','u_duplicate_problem_id','u_observer','u_problem_manager'
  ];

  me.qryObj = queryObject;

  // From qry parameter sysparm_fields, generate select statement and add additional displayvalue fields for all guid fileds
  var dispKey = "";
  for (var i = 0; i < sysparmFieldsAry.length; i++) {

        if(me.dvListArray.indexOf(sysparmFieldsAry[i])>=0 ) {
        
        dispKey = "dv_" + sysparmFieldsAry[i];
        queryObject.sysparm_fields = queryObject.sysparm_fields + "," + dispKey;        
      }
    }  

  // From qry parameter sysparm_query, generate where clause
  var  tmp_array = S(sysparm_query).split('^');
  var whereClause = ""; 
  for (var i = 0; i < tmp_array.length; i++) { 
    
    var keyValArray = getKeyValue(tmp_array[i]);
    var key = keyValArray[0];
    var val = keyValArray[1];

    var operatr = "";
    var andOrOpert = "";

    if (tmp_array[i].includes('>') ) {
      operatr = '>';
    } else if (tmp_array[i].includes('<') ) {
      operatr = '<';
    } else if (tmp_array[i].includes('=') ) {
      operatr = '=';
    } else if (tmp_array[i].includes('!=') ) {
      operatr = '!=';
    }

    if (whereClause.includes(key)) {
      andOrOpert = ' or ';
    } else {
      andOrOpert = ' and ';
    }

    if(me.dvListArray.indexOf(key)>=0 ) {
      
      dispKey = "dv_" + key;
      
      if(i===0) {
        whereClause = whereClause + "(" + key + " " + operatr +  "  '" +  val + "' or " +
        dispKey +  " " + operatr +  "  '" +  val + "')";
      } else {
        whereClause = whereClause + andOrOpert + "(" + key + " " + operatr +  "  '" +  val + "' or " +
        dispKey +  " " + operatr +  "  '" +  val + "')";
      }       
    } else {

      if(i===0) {
        whereClause = whereClause + key + " " + operatr +  "  '" +  val + "'";
      } else {
        whereClause = whereClause + andOrOpert + key + " " + operatr +  "  '" +  val + "'";
      }

    }
    
  } 

  var finalQuery= "";

  if (whereClause.length > 0) {    
    finalQuery="SELECT " +
      queryObject.sysparm_fields + " FROM v_problem where " + whereClause;
  } else {
    finalQuery="SELECT "+ queryObject.sysparm_fields + " FROM v_pr ";
  }

  
  if (queryObject.sysparm_order && queryObject.sysparm_order.length > 0) {
    finalQuery= finalQuery + " order by " + queryObject.sysparm_order;
  }
  
  if (queryObject.sysparm_limit) {
    finalQuery= finalQuery + " limit " + queryObject.sysparm_limit;
    
    if (queryObject.sysparm_offset) {
      finalQuery= finalQuery + " offset " + queryObject.sysparm_offset;
    }
  }  
  logger.debug(" Final Query : "+ finalQuery);
      
    Connection.query(finalQuery, (err, serData) => {

        if (err) {
          logger.error("Error querying servers : " + err);
          return next(err);
        }        
        else {
         
          var dvKey = "";
         // console.log("me.qryObj.sysparm_display_value : " + me.qryObj.sysparm_display_value);
         logger.debug(" Database connection sucess : ");

         if(me.qryObj.sysparm_display_value) {
          if (me.qryObj.sysparm_display_value.toUpperCase() == "TRUE") {                        
                        for(var i= 0; i<serData.length; i++) {                          
                                    for (var key in serData[i]) {                                    
                                      if(me.dvListArray.indexOf(key)>=0 ) {                                        
                                        dvKey = "dv_" + key;                                      
                                        serData[i][key] = {
                                          "display_value": serData[i][dvKey]
                                        };                                        
                                        delete serData[i][dvKey];
                                      }
                                    }                          
                                   }            
                      } else if (me.qryObj.sysparm_display_value.toUpperCase() == "FALSE") {
                        for(var i= 0; i<serData.length; i++) {                          
                                    for (var key in serData[i]) {                        
                                      if(me.dvListArray.indexOf(key)>=0 ) {
                                        dvKey = "dv_" + key;                          
                                        serData[i][key] = {
                                          "value": serData[i][key]
                                        };                                        
                                        delete serData[i][dvKey];
                                      }
                                    }                          
                                   }
                      } 
                      else  {
                        for(var i= 0; i<serData.length; i++) {                          
                                    for (var key in serData[i]) {                        
                                      if(me.dvListArray.indexOf(key)>=0 ) {
                                        dvKey = "dv_" + key;                          
                                        serData[i][key] = {
                                          "value": serData[i][key],
                                          "display_value": serData[i][dvKey]
                                        };                                        
                                        delete serData[i][dvKey];
                                      }
                                    }                          
                                   }
                      }  

         } else {
            for(var i= 0; i<serData.length; i++) {              
                        for (var key in serData[i]) {                        
                          if(me.dvListArray.indexOf(key)>=0 ) {
                            dvKey = "dv_" + key;                          
                            serData[i][key] = {
                              "value": serData[i][key],
                              "display_value": serData[i][dvKey]
                            };                            
                            delete serData[i][dvKey];
                          }
                        }              
                       }
          }         
           callback(serData);
        }
  
      });
  
  }

var getKeyValue = function(keyValueStr) {

  var keyvalArr = "";
  
  if (keyValueStr.includes('>') ) {
    keyvalArr = keyValueStr.split('>');
  } else if (keyValueStr.includes('<') ) {
    keyvalArr = keyValueStr.split('<');
  } else if (keyValueStr.includes('=') ) {
    keyvalArr = keyValueStr.split('=');
  } else if (keyValueStr.includes('!=') ) {
    keyvalArr = keyValueStr.split('!=');
  } 

  return keyvalArr;

}
/**
 * Validating the response
 * * @param response and  schema
 */

var joiResValidation = function (response, schema, callback) {

  Joi.validate(JSON.stringify(response), schema, function (err, value) {
    if (err) {
      callback(err);
    } else {
      callback(value);
    }
  });
};

module.exports = {  
    getProblemResponse: getProblemResponse,
    joiResValidation:joiResValidation
};
