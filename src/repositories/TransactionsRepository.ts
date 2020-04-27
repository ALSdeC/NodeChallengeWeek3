import { EntityRepository, Repository, getRepository, createQueryBuilder } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {

    const { income } = await this
      .createQueryBuilder()
      .select("SUM(value)", "income")
      .where({ type: 'income'})
      .getRawOne();

    const { outcome } = await this
      .createQueryBuilder()
      .select("SUM(value)", "outcome")
      .where({ type: 'outcome'})
      .getRawOne();

    const total = +income- +outcome;

    const balance : Balance = {
        income: +income,
        outcome: +outcome,
        total: total
    };

    return balance;
  }
}

export default TransactionsRepository;
