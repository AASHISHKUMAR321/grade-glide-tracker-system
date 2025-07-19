import { v4 as uuidv4 } from 'uuid';
import Database from '../db/connection';
import { subjects } from '../db/schema';
import { eq } from 'drizzle-orm';
import { Subject, CreateSubjectDto, UpdateSubjectDto } from '../interfaces/Subject';
import logger from '../utils/logger';

export class SubjectModel {
  private db: any;

  constructor() {
    this.db = Database.getInstance().getDb();
  }

  async create(subjectData: CreateSubjectDto): Promise<Subject> {
    try {
      const id = uuidv4();
      const now = new Date();
      
      const newSubject = {
        id,
        name: subjectData.name,
        description: subjectData.description || null,
        createdAt: now,
        updatedAt: now,
      };

      await this.db.insert(subjects).values(newSubject);
      logger.info(`Subject created with ID: ${id}`);
      
      return newSubject as Subject;
    } catch (error) {
      logger.error('Error creating subject:', error);
      throw error;
    }
  }

  async findAll(): Promise<Subject[]> {
    try {
      const result = await this.db.select().from(subjects);
      logger.debug(`Retrieved ${result.length} subjects`);
      return result as Subject[];
    } catch (error) {
      logger.error('Error retrieving subjects:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Subject | null> {
    try {
      const result = await this.db
        .select()
        .from(subjects)
        .where(eq(subjects.id, id))
        .limit(1);
      
      if (result.length === 0) {
        logger.debug(`Subject with ID ${id} not found`);
        return null;
      }
      
      logger.debug(`Retrieved subject with ID: ${id}`);
      return result[0] as Subject;
    } catch (error) {
      logger.error(`Error retrieving subject with ID ${id}:`, error);
      throw error;
    }
  }

  async update(id: string, subjectData: UpdateSubjectDto): Promise<Subject | null> {
    try {
      // Check if subject exists
      const existingSubject = await this.findById(id);
      if (!existingSubject) {
        logger.debug(`Subject with ID ${id} not found for update`);
        return null;
      }

      const updateData = {
        ...subjectData,
        updatedAt: new Date(),
      };

      await this.db
        .update(subjects)
        .set(updateData)
        .where(eq(subjects.id, id));
      
      logger.info(`Subject with ID ${id} updated`);
      
      // Return updated subject
      return await this.findById(id);
    } catch (error) {
      logger.error(`Error updating subject with ID ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      // Check if subject exists
      const existingSubject = await this.findById(id);
      if (!existingSubject) {
        logger.debug(`Subject with ID ${id} not found for deletion`);
        return false;
      }

      await this.db
        .delete(subjects)
        .where(eq(subjects.id, id));
      
      logger.info(`Subject with ID ${id} deleted`);
      return true;
    } catch (error) {
      logger.error(`Error deleting subject with ID ${id}:`, error);
      throw error;
    }
  }
}
