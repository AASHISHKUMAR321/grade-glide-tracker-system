import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { SubjectModel } from '../../models/Subject';
import { CreateSubjectDto } from '../../interfaces/Subject';
import logger from '../../utils/logger';

export class CreateSubjectController extends BaseController {
  private subjectModel: SubjectModel;

  constructor() {
    super();
    this.subjectModel = new SubjectModel();
  }

  protected async executeImpl(req: Request, res: Response): Promise<void> {
    try {
      const subjectDto: CreateSubjectDto = req.body;
      
      // Validate input
      if (!subjectDto.name) {
        logger.debug('Subject name is required');
        return this.clientError(res, 'Subject name is required');
      }
      
      // Create subject
      const subject = await this.subjectModel.create(subjectDto);
      
      logger.info(`Subject created: ${subject.id}`);
      return this.created(res, subject);
    } catch (error) {
      logger.error('Error in CreateSubjectController:', error);
      return this.fail(res, error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  }
}
