import winston from 'winston';
import bcrypt from 'bcrypt';
import { Response } from 'express';
import User, { IUser } from '../model/user';
import BaseController from './BaseController';
import { TReqHandler } from './IController';
import { generateAccessToken, generateRefreshToken } from '../util';

export type UserRefreshToken = {
  expired: number,
  access_token: string,
  username: string,
};

export type UserMapRefreshToken = {
  [refresh_token: string]: UserRefreshToken
};

export const USER_REFRESH_TOKEN: UserMapRefreshToken = {};
export default class UserController extends BaseController<IUser> {
  constructor(public logger: winston.Logger) {
    super(logger, User);
  }

  create: TReqHandler = async (req, res, next) => {
    try {
      const param = req.body;
      param.password = await bcrypt.hash(param.password, await bcrypt.genSalt(10));
      const result = await this.model.create(param);

      return res.send({ data: result });
    } catch (e) {
      this.logger.log({ level: 'error', message: e.toString() });

      return next(e);
    }
  };

  authUser: TReqHandler = async (req, res, next) => {
    try {
      if (!(req.body && req.body.password)) {
        return res.status(400).send({ message: 'Password is not present' });
      }

      const filter: any = {};

      if (req.body && req.body.email) filter.email = req.body.email;
      if (req.body && req.body.username) filter.username = req.body.username;

      if (!Object.keys(filter).length) {
        return res.status(400).send({ message: 'Username or Email is not present' });
      }

      const users = await this.model.find(filter, undefined, { lean: true, limit: 1 });

      if (users && users.length) {
        const user = users[0];
        const { password, ...restUser } = user;

        const valid = await bcrypt.compare(req.body.password, user.password);

        if (valid) {
          const token = generateAccessToken(user);
          this.setRefreshToken(res, user.username, token);

          return res.send({ data: { ...restUser, token } });
        }

        return res.status(401).send({ message: 'Password are invalid' });
      }

      return res.status(401).send({ message: 'Cannot find username or email' });
    } catch (e) {
      this.logger.log({ level: 'error', message: e.toString() });

      return next(e);
    }
  };

  sessionUser: TReqHandler = async (req, res) => {
    const refreshToken: UserRefreshToken = req.cookies.refresh_token
      && USER_REFRESH_TOKEN[req.cookies.refresh_token];

    if (refreshToken && refreshToken.username) {
      const filter = { username: refreshToken.username };
      const users = await this.model.find(filter, undefined, { lean: true, limit: 1 });

      if (users && users.length) {
        const user = users[0];
        const { password, ...restUser } = user;

        return res.send({ data: { ...restUser, token: refreshToken.access_token } });
      }

      this.revokeRefreshToken(req, res);

      return res.status(401).send({ message: 'Cannot find username or email' });
    }

    return res.status(401).send({ message: 'Unauthorize' });
  };

  removeAuthUser: TReqHandler = async (req, res, next) => {
    try {
      if (req.cookies.refresh_token) {
        this.revokeRefreshToken(req, res);

        return res.send({ message: 'Logged out succeed' });
      }

      return res.status(401).send({ message: 'Unauthorize' });
    } catch (e) {
      this.logger.log({ level: 'error', message: e.toString() });

      return next(e);
    }
  };

  revokeRefreshToken = (req: any, res: Response) => {
    delete USER_REFRESH_TOKEN[req.cookies.refresh_token];

    res.cookie('refresh_token', '', {
      httpOnly: true,
      secure: true,
      expires: new Date(),
    });
  };

  setRefreshToken = (res: Response, username: string, token: string) => {
    const threeDay = 3 * 24 * 60 * 60 * 100;
    const expired = new Date(Date.now() + threeDay);
    const cookieOption = {
      httpOnly: true,
      expires: expired,
      secure: true,
    };

    const refreshToken = generateRefreshToken();

    USER_REFRESH_TOKEN[refreshToken] = {
      access_token: token, username, expired: expired.getTime(),
    };

    res.cookie('refresh_token', refreshToken, cookieOption);
  };
}
