import apiClient from '../config/apiConfig';
import { 
  Subject, 
  CreateSubjectDto, 
  UpdateSubjectDto 
} from '../../types/models';

/**
 * Service for handling Subject API requests
 */
export const subjectService = {
  /**
   * Get all subjects
   */
  getAllSubjects: async (): Promise<Subject[]> => {
    const response = await apiClient.get<Subject[]>('/subjects');
    return response.data;
  },

  /**
   * Get subject by ID
   */
  getSubjectById: async (id: string): Promise<Subject> => {
    const response = await apiClient.get<Subject>(`/subjects/${id}`);
    return response.data;
  },

  /**
   * Create a new subject
   */
  createSubject: async (subject: CreateSubjectDto): Promise<Subject> => {
    const response = await apiClient.post<Subject>('/subjects', subject);
    return response.data;
  },

  /**
   * Update an existing subject
   */
  updateSubject: async (id: string, subject: UpdateSubjectDto): Promise<Subject> => {
    const response = await apiClient.put<Subject>(`/subjects/${id}`, subject);
    return response.data;
  },

  /**
   * Delete a subject
   */
  deleteSubject: async (id: string): Promise<void> => {
    await apiClient.delete(`/subjects/${id}`);
  }
};
