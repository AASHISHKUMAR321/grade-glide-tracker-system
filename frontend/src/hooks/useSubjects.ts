import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { subjectService } from '../api/services/subjectService';
import { CreateSubjectDto, UpdateSubjectDto } from '../types/models';

/**
 * Hook for managing subjects with React Query
 */
export const useSubjects = () => {
  const queryClient = useQueryClient();

  // Get all subjects
  const { data: subjects = [], isLoading, error } = useQuery({
    queryKey: ['subjects'],
    queryFn: subjectService.getAllSubjects,
  });

  // Get subject by ID
  const getSubject = (id: string) => {
    return useQuery({
      queryKey: ['subjects', id],
      queryFn: () => subjectService.getSubjectById(id),
    });
  };

  // Create subject
  const createSubject = useMutation({
    mutationFn: (subject: CreateSubjectDto) => subjectService.createSubject(subject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });

  // Update subject
  const updateSubject = useMutation({
    mutationFn: ({ id, subject }: { id: string; subject: UpdateSubjectDto }) => 
      subjectService.updateSubject(id, subject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });

  // Delete subject
  const deleteSubject = useMutation({
    mutationFn: (id: string) => subjectService.deleteSubject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });

  return {
    subjects,
    isLoading,
    error,
    getSubject,
    createSubject,
    updateSubject,
    deleteSubject,
  };
};
