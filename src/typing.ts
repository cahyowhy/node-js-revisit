import { ParamsDictionary } from "express-serve-static-core";
import { Request, RequestHandler } from "express";

export type ReqQueryOpt = {
    limit?: number,
    skip?: number,
};

export type ReqQuery = {
    filter?: any,
    fields?: string,
    options?: ReqQueryOpt
};

export interface TRequest<T = void> extends Request<ParamsDictionary, any, T, ReqQuery> {
    user?: any
};

export type TReqHandler<T> = RequestHandler<ParamsDictionary, any, T, ReqQuery, any>;

export type ResponseSend<T = void> = {
    success: Boolean,
    message?: string,
    data?: T | T[],
    token?: string,
    httpStatus?: number
};