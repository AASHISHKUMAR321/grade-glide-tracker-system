import apiClient from '../config/apiConfig';
import { 
  Competency, 
  CreateCompetencyDto, 
  UpdateCompetencyDto 
} from '../../types/models';

/**
 * Service for handling Competency API requests
 */
export const competencyService = {
  /**
   * Get all competencies
   */
  getAllCompetencies: async (): Promise<Competency[]> => {
    const response = await apiClient.get<Competency[]>('/competencies');
    return response.data;
  },

  /**
   * Get competency by ID
   */
  getCompetencyById: async (id: string): Promise<Competency> => {
    const response = await apiClient.get<Competency>(`/competencies/${id}`);
    return response.data;
  },

  /**
   * Get competencies by subject ID
   */
  getCompetenciesBySubjectId: async (subjectId: string): Promise<Competency[]> => {
    const response = await apiClient.get<Competency[]>(`/competencies/subject/${subjectId}`);
    return response.data;
  },

  /**
   * Create a new competency
   */
  createCompetency: async (competency: CreateCompetencyDto): Promise<Competency> => {
    const response = await apiClient.post<Competency>('/competencies', competency);
    return response.data;
  },

  /**
   * Update an existing competency
   */
  updateCompetency: async (id: string, competency: UpdateCompetencyDto): Promise<Competency> => {
    const response = await apiClient.put<Competency>(`/competencies/${id}`, competency);
    return response.data;
  },

  /**
   * Delete a competency
   */
  deleteCompetency: async (id: string): Promise<void> => {
    await apiClient.delete(`/competencies/${id}`);
  }
};
