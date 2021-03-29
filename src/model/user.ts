import { Schema, model } from 'mongoose';
import { IModel } from './imodel';

export interface IUser extends IModel {
  email: string,
  firstName: string,
  password: string,
  username: string,
  phoneNumber: string,
  birthDate: Date
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
  password: { type: String, required: true },
  username: {
    type: String, required: true, unique: true,
  },
  phoneNumber: {
    type: String, required: true, unique: true,
  },
  birthDate: { type: Date, required: true },
});

export default model<IUser>('users', UserSchema);
