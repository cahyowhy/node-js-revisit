import { Ajv } from 'ajv';
import winston from 'winston';
import user from '../model/user';
import UserBook, { borowBookJsonSchema, IUserBook, jsonSchema } from '../model/user_book';
import BaseController from './BaseController';
import { TReqHandler } from './IController';

export default class UserBookController extends BaseController<IUserBook> {
  constructor(public logger: winston.Logger, public ajv: Ajv,
    public borrowValidator = ajv.compile(borowBookJsonSchema)) {
    super(logger, ajv, UserBook, ajv.compile(jsonSchema), ajv.compile(jsonSchema));
  }

  returnBook: TReqHandler = async (req, res, next) => {
    try {
      const { bookId, userId } = req.params;
      const filter = { 'books.id': bookId, 'user.id': userId, 'books.returnDate': { $exist: false } };
      const userBook = await this.model.findOne(filter).lean();

      if (!userBook) {
        return res.status(404).send({ message: 'Book not found' });
      }

      if ((req as any).user && (req as any).user.type !== 'ADMIN') {
        return res.status(401).send({ message: 'Unauthorized' });
      }

      const paramUpdate = { $set: { 'books.$.returnDate': new Date() } };
      await this.model.updateOne(filter, paramUpdate);

      return res.send({ message: 'update success' });
    } catch (e) {
      return next(e);
    }
  };

  borrowBook: TReqHandler = async (req, res, next) => {
    try {
      if (this.borrowValidator(req.body)) {
        const { userId } = req.params;
        const bookId = req.body.id;
        const userField = {
          _id: 1, email: 1, firstName: 1, lastName: 1,
        };
        const filterUser = { 'user.id': userId };
        const filterUserBook = { 'user.id': userId, 'books.id': bookId };

        const [userData, totalUser, userBook] = await Promise.all([
          user.findById(userId, userField).lean(),
          this.model.count(filterUser).lean(),
          this.model.findOne(filterUserBook, { books: 1 }).lean(),
        ]);

        if (!userData) {
          return res.status(404).send({ message: 'User not found' });
        }

        if (userBook !== null) {
          const containBook = userBook.books.some((book) => book.id.toString() === bookId
            && !book.returnDate);

          if (containBook) {
            return res.status(400).send({ message: 'User already borrow this book. Return this books first.' });
          }
        }

        if (totalUser > 0) {
          const paramUpdate: any = { $push: { books: req.body } };
          await this.model.updateOne(filterUser, paramUpdate).lean();

          return res.send({ message: 'update success' });
        }

        const paramCreate = { user: userData, books: [req.body] };
        // eslint-disable-next-line no-underscore-dangle
        paramCreate.user.id = paramCreate.user._id;
        // eslint-disable-next-line no-underscore-dangle
        delete paramCreate.user._id;

        const result = await this.model.create(paramCreate);

        return res.send({ data: result });
      }

      return res.status(400).send(this.borrowValidator.errors);
    } catch (e) {
      return next(e);
    }
  };
}
