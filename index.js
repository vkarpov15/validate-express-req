'use strict';

const Archetype = require('archetype');

module.exports = function createMiddleware(type) {
  if (type == null) {
    throw new TypeError('Must pass an object parameter `type` to ' +
      'validate-express-req');
  }
  if (type instanceof Archetype) {
    type = type.compile('ValidateReqType');
  } else if (type.constructor.name === 'Object') {
    type = new Archetype(type).compile('ValidateReqType');
  }

  return function validateReqMiddleware(req, res, next) {
    let _casted;

    try {
      _casted = new type(req);
    } catch (error) {
      res.status(400);
      return next(error);
    }

    Object.assign(req, _casted);
    next();
  };
};