import { ParamsDictionary, RequestHandler } from 'express-serve-static-core';

export type ReqBody = {
  [key: string]: any
};

export type ReqQuery = {
  skip?: number,
  limit?: number,
  filter?: any,
  fields?: string | Array<string>
};

export type TReqHandler = RequestHandler<ParamsDictionary, any,
ReqBody, ReqQuery, any>;

export default interface IController {
  find: TReqHandler;
  create: TReqHandler;
  update: TReqHandler;
  delete: TReqHandler;
  count: TReqHandler;
}
