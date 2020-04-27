import AppError from '../errors/AppError';

import { getCustomRepository, getRepository } from 'typeorm';

import TransactionRepository from '../repositories/TransactionsRepository';
import { response } from 'express';

class DeleteTransactionService {
  public async execute(id: string): Promise<any> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    const transation = await transactionRepository.findOne(id);
    if(!transation)
    {
      throw new AppError('The transaction does not exist!');
    }
    await transactionRepository.remove(transation);
  }
}

export default DeleteTransactionService;
