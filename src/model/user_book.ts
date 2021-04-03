import { Schema, model } from 'mongoose';
import { IModel } from './imodel';
import { IUser } from './user';

export interface IUserBook extends IModel {
  user: Pick<IUser, 'email' | 'firstName' | 'lastName' | 'id'>,
  books: {
    id: string,
    title: string,
    borrowDate: Date,
    returnDate: Date,
  }[]
}

const UserBookSchema = new Schema({
  user: {
    _id: false,
    id: { type: Schema.Types.ObjectId, required: true },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  books: [
    {
      _id: false,
      id: { type: Schema.Types.ObjectId, required: true },
      title: { type: String, required: true },
      borrowDate: { type: Date, required: true },
      returnDate: { type: Date },
    },
  ],
});

export const borowBookJsonSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    borrowDate: { type: 'string', format: 'date-time' },
  },
  required: [
    'id',
    'title',
    'borrowDate',
  ],
};

export const jsonSchema = {
  type: 'object',
  properties: {
    user: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
      },
      required: [
        'id',
        'email',
        'firstName',
        'lastName',
      ],
    },
    books: {
      type: 'array',
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        borrowDate: { type: 'string', format: 'date-time' },
        returnDate: { type: 'string', format: 'date-time' },
      },
      required: [
        'id',
        'title',
        'borrowDate',
      ],
    },
  },
  required: [
    'user',
    'books',
  ],
  additionalProperties: false,
};

export default model<IUserBook>('user_books', UserBookSchema);
