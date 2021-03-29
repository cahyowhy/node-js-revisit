import winston from 'winston';
import { Model, Document } from 'mongoose';
import IController, { TReqHandler } from './IController';
import Constant from '../constant';

export default abstract class BaseController<T extends Document> implements IController {
  constructor(public logger: winston.Logger, public model: Model<T>) { }

  find: TReqHandler = async (req, res, next) => {
    try {
      const results = await this.model.find(req.query.filter || {}, req.query.fields, {
        limit: req.query.limit || Constant.DEFAULT_LIMIT,
        skip: req.query.skip || 0,
        lean: true,
      });

      return res.send({ data: results });
    } catch (e) {
      this.logger.log({ level: 'error', message: e.toString() });

      return next(e);
    }
  };

  count: TReqHandler = async (req, res, next) => {
    try {
      const result = await this.model.count(req.query.filter || {});

      return res.send({ data: result });
    } catch (e) {
      this.logger.log({ level: 'error', message: e.toString() });

      return next(e);
    }
  };

  create: TReqHandler = async (req, res, next) => {
    try {
      const result = await this.model.create(req.body);

      return res.send({ data: result });
    } catch (e) {
      this.logger.log({ level: 'error', message: e.toString() });

      return next(e);
    }
  };

  update: TReqHandler = async (req, res, next) => {
    try {
      const filter: any = { _id: req.params.id };
      const { body } = req as any;
      const result = await this.model.updateOne(filter, body, { lean: true });

      return res.send({ data: result });
    } catch (e) {
      this.logger.log({ level: 'error', message: e.toString() });

      return next(e);
    }
  };

  delete: TReqHandler = async (req, res, next) => {
    try {
      await this.model.deleteOne({ _id: req.params.id }, { lean: true });

      return res.send({ success: true });
    } catch (e) {
      this.logger.log({ level: 'error', message: e.toString() });

      return next(e);
    }
  };
}
