/**
 * Error message generator
 * @author PXB8606
 */

var buildErrorMessage = function (err) {
  return JSON.stringify({
    "errorCode": err.status,//TODO define standard error codes
    "developerMessage": err.developerMessage,
    "userMessage": err.userMessage || ''
  })
};

var buildErrorMessageDev = function (err) {
  return JSON.stringify({
    "errorCode": err.status,//TODO define standard error codes
    "errorName": err.name,
    "errorMessage": err.message,
    "stack": err.stack
  })
};

var invalidDeviceId = function () {
  return {
    "developerMessage": "The device doesn't exists or invalid.",
    "userMessage": "No results found!",
    "status": 404,
    "errorCode": "TBD"//TODO define standard error codes
  }

};

var offsetExceeds = function () {
  return {
    "developerMessage": "Provide developers suggestions about how to solve their problems here123",
    "userMessage": "This is a message that can be passed along to end-users, if needed",
    "status": "Shows the status of the error",
    "errorCode": "Gives the error code"
  }
};
var invalidField = function () {
  return {
"developerMessage": "Plese check the fields.",
  "userMessage": "No results found!",
  "status": 404,
  "errorCode": "TBD"//TODO define standard error codes
}
};

module.exports = {
  buildErrorMessage: buildErrorMessage,
  buildErrorMessageDev: buildErrorMessageDev,
  invalidDeviceId: invalidDeviceId,
  offsetExceeds: offsetExceeds,
  invalidField: invalidField
};
