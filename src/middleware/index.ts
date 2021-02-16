import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { TRequest } from "../typing";

export const queryParseHandler: RequestHandler = function (req, _res, next) {
    if (req.query && req.query['filter'] && typeof req.query['filter'] == "string") {
        try {
            const filter = JSON.parse(req.query['filter']);

            req.query = { ...req.query, filter };
        } catch (e) {
            console.log(e);
        }
    } else if (!(req.query && req.query['filter'] && typeof req.query['filter'] == "object")) {
        delete req.query['filter'];
    }

    return next();
};

/**
 * last middleware that will catch as err
 * 
 * @param err 
 * @param _req 
 * @param res 
 */
export const errorHandler = function (err: any, _req: any, res: any) {
    res.status(500).send({ success: false, data: err && err.stack })
};

export const authenticateAccessToken: RequestHandler = async function (req: TRequest, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, (process.env.JWT_SECRET as string), (err, user) => {
            if (err) {
                res.status(403).send({ success: false, message: "Failed verify access token" });
            }

            req.user = user;

            next();
        });
    } else {
        res.status(401).send({ success: false, message: "unauthorize" });
    }
};