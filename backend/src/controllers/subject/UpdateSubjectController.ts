import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { SubjectModel } from '../../models/Subject';
import { UpdateSubjectDto } from '../../interfaces/Subject';
import logger from '../../utils/logger';

export class UpdateSubjectController extends BaseController {
  private subjectModel: SubjectModel;

  constructor() {
    super();
    this.subjectModel = new SubjectModel();
  }

  protected async executeImpl(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const subjectDto: UpdateSubjectDto = req.body;
      
      if (!id) {
        logger.debug('Subject ID is required');
        return this.clientError(res, 'Subject ID is required');
      }
      
      // Check if there's anything to update
      if (Object.keys(subjectDto).length === 0) {
        logger.debug('No update data provided');
        return this.clientError(res, 'No update data provided');
      }
      
      const updatedSubject = await this.subjectModel.update(id, subjectDto);
      
      if (!updatedSubject) {
        logger.debug(`Subject with ID ${id} not found`);
        return this.notFound(res, `Subject with ID ${id} not found`);
      }
      
      logger.info(`Subject with ID ${id} updated`);
      return this.ok(res, updatedSubject);
    } catch (error) {
      logger.error('Error in UpdateSubjectController:', error);
      return this.fail(res, error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  }
}
