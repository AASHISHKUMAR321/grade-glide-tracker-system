import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { SubjectModel } from '../../models/Subject';
import { CompetencyModel } from '../../models/Competency';
import logger from '../../utils/logger';

export class DeleteSubjectController extends BaseController {
  private subjectModel: SubjectModel;
  private competencyModel: CompetencyModel;

  constructor() {
    super();
    this.subjectModel = new SubjectModel();
    this.competencyModel = new CompetencyModel();
  }

  protected async executeImpl(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        logger.debug('Subject ID is required');
        return this.clientError(res, 'Subject ID is required');
      }
      
      // Check if subject exists
      const subject = await this.subjectModel.findById(id);
      if (!subject) {
        logger.debug(`Subject with ID ${id} not found`);
        return this.notFound(res, `Subject with ID ${id} not found`);
      }
      
      // Delete all competencies associated with this subject
      await this.competencyModel.deleteBySubjectId(id);
      logger.info(`Deleted all competencies for subject ID: ${id}`);
      
      // Delete the subject
      await this.subjectModel.delete(id);
      logger.info(`Subject with ID ${id} deleted`);
      
      return this.ok(res, { message: `Subject with ID ${id} and all associated competencies deleted successfully` });
    } catch (error) {
      logger.error('Error in DeleteSubjectController:', error);
      return this.fail(res, error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  }
}
