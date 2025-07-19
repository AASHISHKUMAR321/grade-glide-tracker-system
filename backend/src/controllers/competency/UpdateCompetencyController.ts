import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { CompetencyModel } from '../../models/Competency';
import { UpdateCompetencyDto } from '../../interfaces/Competency';
import logger from '../../utils/logger';

export class UpdateCompetencyController extends BaseController {
  private competencyModel: CompetencyModel;

  constructor() {
    super();
    this.competencyModel = new CompetencyModel();
  }

  protected async executeImpl(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const competencyDto: UpdateCompetencyDto = req.body;
      
      if (!id) {
        logger.debug('Competency ID is required');
        return this.clientError(res, 'Competency ID is required');
      }
      
      // Check if there's anything to update
      if (Object.keys(competencyDto).length === 0) {
        logger.debug('No update data provided');
        return this.clientError(res, 'No update data provided');
      }
      
      // Validate marks if provided
      if (competencyDto.marks !== undefined && (competencyDto.marks < 0 || competencyDto.marks > 10)) {
        logger.debug('Marks must be between 0 and 10');
        return this.clientError(res, 'Marks must be between 0 and 10');
      }
      
      const updatedCompetency = await this.competencyModel.update(id, competencyDto);
      
      if (!updatedCompetency) {
        logger.debug(`Competency with ID ${id} not found`);
        return this.notFound(res, `Competency with ID ${id} not found`);
      }
      
      logger.info(`Competency with ID ${id} updated`);
      return this.ok(res, updatedCompetency);
    } catch (error) {
      logger.error('Error in UpdateCompetencyController:', error);
      return this.fail(res, error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  }
}
