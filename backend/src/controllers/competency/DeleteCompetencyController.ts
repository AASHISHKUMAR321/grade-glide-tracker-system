import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { CompetencyModel } from '../../models/Competency';
import logger from '../../utils/logger';

export class DeleteCompetencyController extends BaseController {
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
      
      // Check if competency exists
      const competency = await this.competencyModel.findById(id);
      if (!competency) {
        logger.debug(`Competency with ID ${id} not found`);
        return this.notFound(res, `Competency with ID ${id} not found`);
      }
      
      // Delete the competency
      await this.competencyModel.delete(id);
      logger.info(`Competency with ID ${id} deleted`);
      
      return this.ok(res, { message: `Competency with ID ${id} deleted successfully` });
    } catch (error) {
      logger.error('Error in DeleteCompetencyController:', error);
      return this.fail(res, error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  }
}
