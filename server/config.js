const ENUMS = {
  TRANSACTION_TYPES: {
    DEBIT: 'debit',
    CREDIT: 'credit'
  }
};

const ERRORS = {
  NOT_FOUND: 'not found',
  CONFLICT: 'conflict'
};

const ERROR_CODES = {
  [ERRORS.NOT_FOUND]: 404,
  [ERRORS.CONFLICT]: 409
};

module.exports = { ENUMS, ERROR_CODES, ERRORS };
