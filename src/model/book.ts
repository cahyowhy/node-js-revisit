import { Schema, model } from 'mongoose';
import { IModel } from './imodel';

export interface IBook extends IModel {
  title: string,
  author: string,
  sheet: number,
  introduction: string,
  dateOffIssue: Date
}

const BookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  sheet: { type: Number, required: true },
  introduction: { type: String },
  dateOffIssue: Date,
});

const properties = {
  title: { type: 'string' },
  author: { type: 'string' },
  sheet: { type: 'number' },
  introduction: { type: 'string' },
  dateOffIssue: { type: 'string', format: 'date-time' },
};

export const jsonUpdateSchema = {
  type: 'object',
  properties,
  oneOf: ['title', 'author', 'sheet', 'introduction', 'dateOffIssue']
    .map((key) => ({ required: [key] })),
};

export const jsonSchema = {
  type: 'object',
  properties,
  required: [
    'title',
    'author',
    'sheet',
  ],
  additionalProperties: false,
};

export default model<IBook>('books', BookSchema);
