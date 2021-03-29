import winston from 'winston';
import UserBook, { IUserBook } from '../model/user_book';
import BaseController from './BaseController';

export default class UserBookController extends BaseController<IUserBook> {
  constructor(public logger: winston.Logger) {
    super(logger, UserBook);
  }
}
