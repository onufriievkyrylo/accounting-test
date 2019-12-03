const Joi = require('joi');

const { ENUMS } = require('../../config');

exports.identifier = Joi.number().positive();

exports.filters = Joi.object({
  offset: Joi.number().integer().min(0).default(0),
  limit: Joi.number().integer().min(1).default(10)
});

exports.transaction = Joi.object({
  amount: Joi.number().required(),
  type: Joi.valid(ENUMS.TRANSACTION_TYPES.DEBIT, ENUMS.TRANSACTION_TYPES.CREDIT).required(),
  description: Joi.string().max(255).required()
});
