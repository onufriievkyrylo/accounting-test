const schema = require('./schema');
const { ENUMS, ERRORS } = require('../../config');

class Account {
  constructor (balance = 0) {
    this.balance = balance;
    this.transactions = [];
    this.queue = Promise.resolve();
  }
  async getState() {
    return { balance: this.balance };
  }
  async getTransaction(payload) {
    const index = await schema.identifier.validate(payload);
    if (!this.transactions[index - 1]) {
      throw new Error(ERRORS.NOT_FOUND);
    }
    return this.transactions[index - 1];
  }
  async getTransactions(payload) {
    const { offset, limit } = await schema.filters.validate(payload);
    return {
      rows: this.transactions
        .slice(offset, offset + limit)
        .map(transaction => ({
          id: transaction.id,
          amount: transaction.amount,
          type: transaction.type
        })),
      count: this.transactions.length
    };
  }
  async createTransaction(payload) {
    const transaction = await schema.transaction.validate(payload);
    return new Promise((resolve, reject) => this._process({
      resolve,
      reject,
      callback: async () => {
        if (transaction.type === ENUMS.TRANSACTION_TYPES.CREDIT) {
          this.balance += transaction.amount;
        } else if (transaction.type === ENUMS.TRANSACTION_TYPES.DEBIT) {
          if (this.balance - transaction.amount >= 0) {
            this.balance -= transaction.amount;
          } else {
            throw new Error(ERRORS.CONFLICT);
          }
        }
        return transaction;
      }
    }));
  }
  _process({ resolve, reject, callback }) {
    this.queue = this.queue
      .finally(() => callback()
        .then(transaction => {
          const completed = { ...transaction, timestamp: Date.now() };
          completed.id = this.transactions.push(completed);
          resolve(completed);
        })
        .catch (reject)
      );
  }
}

module.exports = Account;