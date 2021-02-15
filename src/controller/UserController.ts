import User, { IUser } from "../model/user";
import { UpdateQuery } from "mongoose";
import { ReqQueryOpt } from "../typing";

export default class UserController {
    static async createUser(param: IUser) {
        return await User.create(param);
    }

    static updateUser(id: String, param: UpdateQuery<IUser>) {
        User.updateOne({ _id: id }, param);
    }

    static async findUser(filter: any, fields?: string | undefined, opt?: ReqQueryOpt) {
        return User.find(filter, fields, opt);
    }

    static deleteUser(id: String) {
        return User.deleteOne({ _id: id });
    }
}