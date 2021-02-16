import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
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
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    birthDate: { type: Date, required: true }
});

export default model<IUser>('users', UserSchema);