import winston from 'winston';
import { Model, Document } from 'mongoose';
import { Ajv, ValidateFunction } from 'ajv';
import IController, { TReqHandler } from './IController';
import Constant from '../constant';

export default abstract class BaseController<T extends Document> implements IController {
  constructor(public logger: winston.Logger, public ajv: Ajv, public model: Model<T>,
    public validator: ValidateFunction, public updateValidator: ValidateFunction) { }

  find: TReqHandler = async (req, res, next) => {
    try {
      const results = await this.model.find(req.query.filter || {}, req.query.fields, {
        limit: req.query.limit || Constant.DEFAULT_LIMIT,
        skip: req.query.skip || 0,
        lean: true,
        sort: req.query.sort || '-id',
      });

      return res.send({ data: results });
    } catch (e) {
      this.logger.log({ level: 'error', message: e.toString() });

      return next(e);
    }
  };

  count: TReqHandler = async (req, res, next) => {
    try {
      const result = await this.model.count(req.query.filter || {}).lean();

      return res.send({ data: result });
    } catch (e) {
      this.logger.log({ level: 'error', message: e.toString() });

      return next(e);
    }
  };

  create: TReqHandler = async (req, res, next) => {
    try {
      if (this.validator(req.body)) {
        const result = await this.model.create(req.body);

        return res.send({ data: result });
      }

      return res.status(400).send(this.validator.errors);
    } catch (e) {
      this.logger.log({ level: 'error', message: e.toString() });

      return next(e);
    }
  };

  update: TReqHandler = async (req, res, next) => {
    try {
      if (this.updateValidator(req.body)) {
        const filter: any = { _id: req.params.id };
        const { body } = req as any;
        await this.model.updateOne(filter, body, { lean: true });

        return res.send({ message: 'update success' });
      }

      return res.status(400).send(this.updateValidator.errors);
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
