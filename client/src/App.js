import React, { Component } from 'react';
import { Collapse, Pagination } from 'antd';
import axios from 'axios';

const { Panel } = Collapse;

class App extends Component {
  state = {
    balance: 0,
    total: 0,
    list: [],
    transactions: {}
  }

  pagination = {
    defaultCurrent: 1,
    pageSize: 10
  }

  async componentDidMount() {
    this.updateBalance();
    this.getTransactions({
      offset: (this.pagination.defaultCurrent - 1) * this.pagination.pageSize,
      limit: this.pagination.pageSize
    })
  }

  handlePageChange = async (page, pageSize) => {
    this.getTransactions({
      offset: (page - 1) * pageSize,
      limit: pageSize
    })
  }

  handleTabChange = async (transactionId) => {
    if (transactionId) {
      this.getTransaction(transactionId);
    }
  }

  updateBalance = async () => {
    try {
    const { data: { balance } } = await axios.get('http://localhost:3001/api/balance');
    this.setState({ balance })
    } catch (err) {
      console.error(err);
    }
  }

  getTransaction = async transactionId => {
    try {
    const { data: transaction } = await axios.get(`http://localhost:3001/api/transactions/${transactionId}`);
    this.setState({
        transactions: { ...this.state.transactions, [transaction.id]: transaction }
      })
    } catch (err) {
      console.error(err);
    }
  }

  getTransactions = async filters => {
    try {
    const { data: { count, rows } } = await axios.get('http://localhost:3001/api/transactions', { params: filters });
    this.setState({
        total: count,
        list: rows.map(transaction => transaction.id),
        transactions: rows.reduce((transactions, transaction) => (
            Object.assign(transactions, { [transaction.id]: transaction })
          ), { ...this.state.transactions })
      })
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const { total, list, transactions, balance } = this.state;
    return (
      <div className="app">
        <div className="balance">
          Current balance: { balance }
        </div>
        <div className="transactions">
          <Collapse accordion className="transactions" onChange={this.handleTabChange}>
            {
              list.map(transactionId => (
              transactionId in transactions
                ? (
                  <Panel
                    key={transactionId}
                    header={
                      <div className={`transaction transaction--${transactions[transactionId].type}`}>
                        { transactions[transactionId].type === 'credit' ? '+' : '-' }
                        { transactions[transactionId].amount}
                      </div>
                    }
                    extra={transactions[transactionId].type}
                  >
                    <dl>
                      <dt>Type</dt>
                      <dd>{ transactions[transactionId].type }</dd>
                      <dt>Amount</dt>
                      <dd>{ transactions[transactionId].amount }</dd>
                      <dt>Description</dt>
                      <dd>{ transactions[transactionId].description }</dd>
                  </dl>
                  </Panel>
                )
                : null
              ))
            }
          </Collapse>
        </div>
        <Pagination { ...this.pagination } total={total} onChange={this.handlePageChange} />
      </div>
    );
  }
}

export default App;
