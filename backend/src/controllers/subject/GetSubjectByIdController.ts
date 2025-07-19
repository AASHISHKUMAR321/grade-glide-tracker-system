import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { SubjectModel } from '../../models/Subject';
import logger from '../../utils/logger';

export class GetSubjectByIdController extends BaseController {
  private subjectModel: SubjectModel;

  constructor() {
    super();
    this.subjectModel = new SubjectModel();
  }

  protected async executeImpl(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        logger.debug('Subject ID is required');
        return this.clientError(res, 'Subject ID is required');
      }
      
      const subject = await this.subjectModel.findById(id);
      
      if (!subject) {
        logger.debug(`Subject with ID ${id} not found`);
        return this.notFound(res, `Subject with ID ${id} not found`);
      }
      
      logger.info(`Retrieved subject with ID: ${id}`);
      return this.ok(res, subject);
    } catch (error) {
      logger.error('Error in GetSubjectByIdController:', error);
      return this.fail(res, error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  }
}
