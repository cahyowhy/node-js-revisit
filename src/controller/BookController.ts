import winston from 'winston';
import Book, { IBook } from '../model/book';
import BaseController from './BaseController';

export default class BookController extends BaseController<IBook> {
  constructor(public logger: winston.Logger) {
    super(logger, Book);
  }
}
