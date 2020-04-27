import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Category from '../models/Category';
import Transaction from '../models/Transaction';

import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string,
  value: number,
  type: 'income' | 'outcome',
  category: string
}

interface Response {
  title: string,
  value: number,
  type: 'income' | 'outcome',
  category: Category
}

class CreateTransactionService {
  public async execute({ title, value, type, category}: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    let categoryTransaction = null;

    const balance = await transactionRepository.getBalance();

    if(type === 'outcome' && (balance.total-value) < 0) {
      throw new AppError('Balance cannot be negative, outcome value invalid');
    }

    if(category)
    {
      const categoryRepository = getRepository(Category);
      const hasCategory = await categoryRepository.findOne({ where: { title: category}});


      if(hasCategory)
        categoryTransaction = hasCategory;
      else
      {
        const categoryEntity = categoryRepository.create({ title: category});
        categoryTransaction = await categoryRepository.save(categoryEntity);
      }
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: categoryTransaction ? categoryTransaction.id : undefined,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
