export interface Subject {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubjectDto {
  name: string;
  description?: string;
}

export interface UpdateSubjectDto {
  name?: string;
  description?: string;
}
