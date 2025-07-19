import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { CompetencyModel } from '../../models/Competency';
import logger from '../../utils/logger';

export class GetCompetencyByIdController extends BaseController {
  private competencyModel: CompetencyModel;

  constructor() {
    super();
    this.competencyModel = new CompetencyModel();
  }

  protected async executeImpl(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        logger.debug('Competency ID is required');
        return this.clientError(res, 'Competency ID is required');
      }
      
      const competency = await this.competencyModel.findById(id);
      
      if (!competency) {
        logger.debug(`Competency with ID ${id} not found`);
        return this.notFound(res, `Competency with ID ${id} not found`);
      }
      
      logger.info(`Retrieved competency with ID: ${id}`);
      return this.ok(res, competency);
    } catch (error) {
      logger.error('Error in GetCompetencyByIdController:', error);
      return this.fail(res, error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  }
}
