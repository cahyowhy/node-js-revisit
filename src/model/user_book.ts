import { Schema, model } from 'mongoose';
import { IModel } from './imodel';
import { IBook } from './book';
import { IUser } from './user';

export interface IUserBook extends IModel {
  user: IUser,
  books: IBook[]
}

const UserBookSchema = new Schema({
  user: {
    _id: false,
    id: { type: Schema.Types.ObjectId },
    email: { type: String },
    firstName: { type: String },
  },
  books: [
    {
      id: { type: Schema.Types.ObjectId },
      title: { type: String },
      borrow_date: { type: Date },
      return_date: { type: Date },
    },
  ],
});

export default model<IUserBook>('user_books', UserBookSchema);
