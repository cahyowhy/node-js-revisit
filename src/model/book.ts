import { Schema, model } from 'mongoose';
import { IModel } from './imodel';

export interface IBook extends IModel {
  title: string,
  author: string,
  sheet: number,
  introduction: string,
  date_of_issue: Date
}

const BookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  sheet: { type: Number, required: true },
  introduction: { type: String },
  date_of_issue: Date,
});

export default model<IBook>('books', BookSchema);
