import UserController from "../controller/UserController";
import { Router } from "express";
import { TReqHandler } from "../typing";
import { IUser } from "../model/user";

const router = Router();

const createUser: TReqHandler<IUser> = async function (req, res, next) {
    try {
        const user = await UserController.createUser(req.body);

        return res.send({ success: true, data: user });
    } catch (e) {
        return next(e);
    }
};

const updateUser: TReqHandler<IUser> = async function (req, res, next) {
    try {
        const user = await UserController.updateUser(req.params['id'], req.body);

        return res.send({ success: true, data: user });
    } catch (e) {
        return next(e);
    }
};

const deleteUser: TReqHandler<IUser> = async function (req, res, next) {
    try {
        const user = await UserController.deleteUser(req.params['id']);

        return res.send({ success: true, data: user });
    } catch (e) {
        return next(e);
    }
};

const findUser: TReqHandler<IUser> = async function (req, res, next) {
    try {
        const user = await UserController.findUser(req.query.filter, req.query.fields, req.query.options);

        return res.send({ success: true, data: user });
    } catch (e) {
        return next(e);
    }
};

router.post('/api/users', createUser);
router.put('/api/users/:id', updateUser);
router.delete('/api/users/:id', deleteUser);
router.get('/api/users/', findUser);

export default router;