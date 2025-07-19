import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { CompetencyModel } from '../../models/Competency';
import logger from '../../utils/logger';

export class GetCompetenciesController extends BaseController {
  private competencyModel: CompetencyModel;

  constructor() {
    super();
    this.competencyModel = new CompetencyModel();
  }

  protected async executeImpl(req: Request, res: Response): Promise<void> {
    try {
      const { subjectId } = req.query;
      
      let competencies;
      
      if (subjectId && typeof subjectId === 'string') {
        // Get competencies for a specific subject
        competencies = await this.competencyModel.findBySubjectId(subjectId);
        logger.info(`Retrieved ${competencies.length} competencies for subject ID: ${subjectId}`);
      } else {
        // Get all competencies
        competencies = await this.competencyModel.findAll();
        logger.info(`Retrieved ${competencies.length} competencies`);
      }
      
      return this.ok(res, competencies);
    } catch (error) {
      logger.error('Error in GetCompetenciesController:', error);
      return this.fail(res, error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  }
}
