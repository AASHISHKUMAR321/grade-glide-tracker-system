import { Request, Response } from 'express';
import logger from '../utils/logger';

export abstract class BaseController {
  protected abstract executeImpl(req: Request, res: Response): Promise<void>;

  public async execute(req: Request, res: Response): Promise<void> {
    try {
      await this.executeImpl(req, res);
    } catch (error) {
      logger.error(`[BaseController]: Uncaught controller error`, error);
      this.fail(res, 'An unexpected error occurred');
    }
  }

  public static jsonResponse(res: Response, code: number, message: string) {
    return res.status(code).json({ message });
  }

  public ok<T>(res: Response, dto?: T) {
    if (dto) {
      return res.status(200).json(dto);
    } else {
      return res.sendStatus(200);
    }
  }

  public created<T>(res: Response, dto?: T) {
    if (dto) {
      return res.status(201).json(dto);
    } else {
      return res.sendStatus(201);
    }
  }

  public clientError(res: Response, message?: string) {
    return BaseController.jsonResponse(res, 400, message || 'Bad request');
  }

  public unauthorized(res: Response, message?: string) {
    return BaseController.jsonResponse(res, 401, message || 'Unauthorized');
  }

  public forbidden(res: Response, message?: string) {
    return BaseController.jsonResponse(res, 403, message || 'Forbidden');
  }

  public notFound(res: Response, message?: string) {
    return BaseController.jsonResponse(res, 404, message || 'Not found');
  }

  public conflict(res: Response, message?: string) {
    return BaseController.jsonResponse(res, 409, message || 'Conflict');
  }

  public tooMany(res: Response, message?: string) {
    return BaseController.jsonResponse(res, 429, message || 'Too many requests');
  }

  public fail(res: Response, error: Error | string) {
    logger.error(error);
    return res.status(500).json({
      message: error.toString()
    });
  }
}
