import User, { ILoginUser, IUser } from "../model/user";
import { UpdateQuery } from "mongoose";
import { ReqQueryOpt, ResponseSend } from "../typing";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../util";
export default class UserController {
    static async createUser(param: IUser) {
        param.password = await bcrypt.hash(param.password, await bcrypt.genSalt(10));

        return await User.create(param);
    }

    static updateUser(id: String, param: UpdateQuery<IUser>) {
        User.updateOne({ _id: id }, param, { lean: true });
    }

    static async findUser(filter: any, fields?: string | undefined, opt?: ReqQueryOpt) {
        return User.find(filter, fields, { ...opt, lean: true });
    }

    static deleteUser(id: String) {
        return User.deleteOne({ _id: id }, { lean: true });
    }

    static async authUser(param: ILoginUser): Promise<ResponseSend<IUser>> {
        const filter: any = {};

        if (param.email) filter['email'] = param.email;
        if (param.username) filter['username'] = param.username;

        let users = await this.findUser(filter);
        if (users && users.length) {
            let user = users[0];

            const valid = await bcrypt.compare(param.password, user.password);

            if (!valid) {
                return { success: false, message: 'Password are not valid', httpStatus: 401 };
            }

            return { success: true, message: "Logged in", token: generateAccessToken(user), data: user };
        }

        return { success: false, message: "Cannot find username or email", httpStatus: 404 };
    }
}