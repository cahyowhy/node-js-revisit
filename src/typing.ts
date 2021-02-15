import { ParamsDictionary } from "express-serve-static-core";
import { Request, RequestHandler} from "express";

export type ReqQueryOpt = {
    limit?: number,
    skip?: number,
};

export type ReqQuery = {
    filter?: any,
    fields?: string,
    options?: ReqQueryOpt
};

export type TRequest<T> = Request<ParamsDictionary, any, T, ReqQuery>;

export type TReqHandler<T> = RequestHandler<ParamsDictionary, any, T, ReqQuery, any>;