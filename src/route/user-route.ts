import UserController from "../controller/UserController";
import { Router } from "express";
import { TReqHandler } from "../typing";
import { ILoginUser, IUser } from "../model/user";
import { authenticateAccessToken } from "../middleware";


const router = Router();

const createUser: TReqHandler<IUser> = async function (req, res, next) {
    const fields = ["email", "firstName", "password", "username", "phoneNumber", "birthDate"];
    if (!fields.every(key => Boolean((req.body as any)[key]))) {
        return res.status(400).send({ success: false, message: `${fields.join(", ")} cannot be empty` });
    }

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

const loginUser: TReqHandler<ILoginUser> = async function (req, res, next) {
    try {
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;

        if (!password || !(email || username)) {
            return res.status(400).send({ success: false, message: 'Email or Username and Password cannot be empty' });
        }

        const param = await UserController.authUser(req.body);

        return res.status(param.httpStatus || 200).send(param);
    } catch (e) {
        return next(e);
    }
};

router.post('/api/users', createUser);
router.put('/api/users/:id', authenticateAccessToken, updateUser);
router.delete('/api/users/:id', authenticateAccessToken, deleteUser);
router.get('/api/users/', authenticateAccessToken, findUser);
router.post('/api/login', loginUser);

export default router;