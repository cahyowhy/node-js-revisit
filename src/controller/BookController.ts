import { Ajv } from 'ajv';
import winston from 'winston';
import Book, { IBook, jsonSchema, jsonUpdateSchema } from '../model/book';
import BaseController from './BaseController';

export default class BookController extends BaseController<IBook> {
  constructor(public logger: winston.Logger, public ajv: Ajv) {
    super(logger, ajv, Book, ajv.compile(jsonSchema), ajv.compile(jsonUpdateSchema));
  }
}
