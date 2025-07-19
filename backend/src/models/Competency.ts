import { v4 as uuidv4 } from 'uuid';
import Database from '../db/connection';
import { competencies } from '../db/schema';
import { eq } from 'drizzle-orm';
import { Competency, CreateCompetencyDto, UpdateCompetencyDto } from '../interfaces/Competency';
import logger from '../utils/logger';

export class CompetencyModel {
  private db: any;

  constructor() {
    this.db = Database.getInstance().getDb();
  }

  async create(competencyData: CreateCompetencyDto): Promise<Competency> {
    try {
      const id = uuidv4();
      const now = new Date();
      
      const newCompetency = {
        id,
        subjectId: competencyData.subjectId,
        name: competencyData.name,
        marks: competencyData.marks,
        description: competencyData.description || null,
        createdAt: now,
        updatedAt: now,
      };

      await this.db.insert(competencies).values(newCompetency);
      logger.info(`Competency created with ID: ${id}`);
      
      return newCompetency as Competency;
    } catch (error) {
      logger.error('Error creating competency:', error);
      throw error;
    }
  }

  async findAll(): Promise<Competency[]> {
    try {
      const result = await this.db.select().from(competencies);
      logger.debug(`Retrieved ${result.length} competencies`);
      return result as Competency[];
    } catch (error) {
      logger.error('Error retrieving competencies:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Competency | null> {
    try {
      const result = await this.db
        .select()
        .from(competencies)
        .where(eq(competencies.id, id))
        .limit(1);
      
      if (result.length === 0) {
        logger.debug(`Competency with ID ${id} not found`);
        return null;
      }
      
      logger.debug(`Retrieved competency with ID: ${id}`);
      return result[0] as Competency;
    } catch (error) {
      logger.error(`Error retrieving competency with ID ${id}:`, error);
      throw error;
    }
  }

  async findBySubjectId(subjectId: string): Promise<Competency[]> {
    try {
      const result = await this.db
        .select()
        .from(competencies)
        .where(eq(competencies.subjectId, subjectId));
      
      logger.debug(`Retrieved ${result.length} competencies for subject ID: ${subjectId}`);
      return result as Competency[];
    } catch (error) {
      logger.error(`Error retrieving competencies for subject ID ${subjectId}:`, error);
      throw error;
    }
  }

  async update(id: string, competencyData: UpdateCompetencyDto): Promise<Competency | null> {
    try {
      // Check if competency exists
      const existingCompetency = await this.findById(id);
      if (!existingCompetency) {
        logger.debug(`Competency with ID ${id} not found for update`);
        return null;
      }

      const updateData = {
        ...competencyData,
        updatedAt: new Date(),
      };

      await this.db
        .update(competencies)
        .set(updateData)
        .where(eq(competencies.id, id));
      
      logger.info(`Competency with ID ${id} updated`);
      
      // Return updated competency
      return await this.findById(id);
    } catch (error) {
      logger.error(`Error updating competency with ID ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      // Check if competency exists
      const existingCompetency = await this.findById(id);
      if (!existingCompetency) {
        logger.debug(`Competency with ID ${id} not found for deletion`);
        return false;
      }

      await this.db
        .delete(competencies)
        .where(eq(competencies.id, id));
      
      logger.info(`Competency with ID ${id} deleted`);
      return true;
    } catch (error) {
      logger.error(`Error deleting competency with ID ${id}:`, error);
      throw error;
    }
  }

  async deleteBySubjectId(subjectId: string): Promise<boolean> {
    try {
      await this.db
        .delete(competencies)
        .where(eq(competencies.subjectId, subjectId));
      
      logger.info(`Competencies for subject ID ${subjectId} deleted`);
      return true;
    } catch (error) {
      logger.error(`Error deleting competencies for subject ID ${subjectId}:`, error);
      throw error;
    }
  }
}
