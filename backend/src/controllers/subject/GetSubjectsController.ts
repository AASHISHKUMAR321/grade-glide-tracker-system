import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { SubjectModel } from '../../models/Subject';
import logger from '../../utils/logger';

export class GetSubjectsController extends BaseController {
  private subjectModel: SubjectModel;

  constructor() {
    super();
    this.subjectModel = new SubjectModel();
  }

  protected async executeImpl(req: Request, res: Response): Promise<void> {
    try {
      const subjects = await this.subjectModel.findAll();
      
      logger.info(`Retrieved ${subjects.length} subjects`);
      return this.ok(res, subjects);
    } catch (error) {
      logger.error('Error in GetSubjectsController:', error);
      return this.fail(res, error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  }
}
