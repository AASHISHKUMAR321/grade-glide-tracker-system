export interface Competency {
  id: string;
  subjectId: string;
  name: string;
  marks: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCompetencyDto {
  subjectId: string;
  name: string;
  marks: number;
  description?: string;
}

export interface UpdateCompetencyDto {
  name?: string;
  marks?: number;
  description?: string;
}
