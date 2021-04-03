import { Schema, model } from 'mongoose';
import { IModel } from './imodel';

export interface IUser extends IModel {
  email: string,
  firstName: string,
  lastName: string,
  password: string,
  username: string,
  phoneNumber: string,
  birthDate: Date,
  type: 'ADMIN' | 'USER'
}

export interface ILoginUser {
  username?: string,
  email?: string,
  password?: string,
}

const UserSchema = new Schema({
  email: {
    type: String, required: true, unique: true,
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  username: {
    type: String, required: true, unique: true,
  },
  phoneNumber: {
    type: String, required: true, unique: true,
  },
  birthDate: { type: Date, required: true },
  type: { type: String, enum: ['ADMIN', 'USER'], default: 'USER' },
});

export const loginJsonSchema = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    username: { type: 'string' },
    password: { type: 'string' },
  },
  oneOf: ['username', 'email'].map((key) => ({ required: [key, 'password'] })),
};

const properties = {
  email: { type: 'string' },
  firstName: { type: 'string' },
  lastName: { type: 'string' },
  password: { type: 'string' },
  username: { type: 'string' },
  phoneNumber: { type: 'string' },
  birthDate: { type: 'string', format: 'date-time' },
};

export const jsonUpdateSchema = {
  type: 'object',
  properties,
  oneOf: ['firstName', 'lastName', 'phoneNumber', 'birthDate']
    .map((key) => ({ required: [key] })),
};

export const jsonSchema = {
  type: 'object',
  properties,
  required: [
    'email',
    'firstName',
    'lastName',
    'password',
    'username',
    'phoneNumber',
    'birthDate',
  ],
  additionalProperties: false,
};

export default model<IUser>('users', UserSchema);
