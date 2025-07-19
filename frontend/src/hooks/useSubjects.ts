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
    onSuccess: (newSubject) => {
      // Immediately update the cache with the new subject
      queryClient.setQueryData(['subjects'], (oldData: any) => {
        return oldData ? [...oldData, newSubject] : [newSubject];
      });
      // Then invalidate to ensure consistency with server
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
    onMutate: async (deletedId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['subjects'] });
      
      // Snapshot the previous value
      const previousSubjects = queryClient.getQueryData(['subjects']);
      
      // Optimistically update to the new value
      queryClient.setQueryData(['subjects'], (oldData: any) => {
        return oldData ? oldData.filter((subject: any) => subject.id !== deletedId) : [];
      });
      
      // Return a context object with the snapshot
      return { previousSubjects };
    },
    onError: (err, deletedId, context: any) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(['subjects'], context.previousSubjects);
    },
    onSettled: () => {
      // Always refetch after error or success
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
