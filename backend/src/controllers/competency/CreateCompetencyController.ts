import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { CompetencyModel } from '../../models/Competency';
import { SubjectModel } from '../../models/Subject';
import { CreateCompetencyDto } from '../../interfaces/Competency';
import logger from '../../utils/logger';

export class CreateCompetencyController extends BaseController {
  private competencyModel: CompetencyModel;
  private subjectModel: SubjectModel;

  constructor() {
    super();
    this.competencyModel = new CompetencyModel();
    this.subjectModel = new SubjectModel();
  }

  protected async executeImpl(req: Request, res: Response): Promise<void> {
    try {
      const competencyDto: CreateCompetencyDto = req.body;
      
      // Validate input
      if (!competencyDto.name) {
        logger.debug('Competency name is required');
        return this.clientError(res, 'Competency name is required');
      }
      
      if (!competencyDto.subjectId) {
        logger.debug('Subject ID is required');
        return this.clientError(res, 'Subject ID is required');
      }
      
      // Validate marks (between 0 and 10)
      if (competencyDto.marks < 0 || competencyDto.marks > 10) {
        logger.debug('Marks must be between 0 and 10');
        return this.clientError(res, 'Marks must be between 0 and 10');
      }
      
      // Check if subject exists
      const subject = await this.subjectModel.findById(competencyDto.subjectId);
      if (!subject) {
        logger.debug(`Subject with ID ${competencyDto.subjectId} not found`);
        return this.notFound(res, `Subject with ID ${competencyDto.subjectId} not found`);
      }
      
      // Create competency
      const competency = await this.competencyModel.create(competencyDto);
      
      logger.info(`Competency created: ${competency.id}`);
      return this.created(res, competency);
    } catch (error) {
      logger.error('Error in CreateCompetencyController:', error);
      return this.fail(res, error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  }
}
