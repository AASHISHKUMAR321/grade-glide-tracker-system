// Subject interface
export interface Subject {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Competency interface
export interface Competency {
  id: string;
  name: string;
  description?: string;
  marks: number;
  subjectId: string;
  createdAt: string;
  updatedAt: string;
}

// API response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Create/Update DTOs
export interface CreateSubjectDto {
  name: string;
  description?: string;
}

export interface UpdateSubjectDto {
  name?: string;
  description?: string;
}

export interface CreateCompetencyDto {
  name: string;
  description?: string;
  marks: number;
  subjectId: string;
}

export interface UpdateCompetencyDto {
  name?: string;
  description?: string;
  marks?: number;
}
