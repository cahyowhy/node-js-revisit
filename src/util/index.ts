import jwt from "jsonwebtoken";
import { IUser } from "../model/user";

export function generateAccessToken(user: IUser) {
    return jwt.sign(user, (process.env.JWT_SECRET as string), { expiresIn: '6h' });
}