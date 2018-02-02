const objectId = require('joi-objectid');
const Joi = require('joi');

Joi.objectId = objectId(Joi);

module.exports = {
  create: {
    body: {
      name: Joi.string(),
      username: Joi.string().required(),
      password: Joi.string().required(),
      dob: Joi.date(),
      address: Joi.string(),
      description: Joi.string(),
    },
  },
  update: {
    body: {
      username: Joi.string(),
      password: Joi.string(),
      name: Joi.string(),
      dob: Joi.date(),
      address: Joi.string(),
      description: Joi.string(),
    },
  },
};
