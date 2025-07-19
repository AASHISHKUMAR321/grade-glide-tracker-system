import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { competencyService } from '../api/services/competencyService';
import { CreateCompetencyDto, UpdateCompetencyDto } from '../types/models';

/**
 * Hook for managing competencies with React Query
 */
export const useCompetencies = () => {
  const queryClient = useQueryClient();

  // Get all competencies
  const { data: competencies = [], isLoading, error } = useQuery({
    queryKey: ['competencies'],
    queryFn: competencyService.getAllCompetencies,
  });

  // Get competency by ID
  const getCompetency = (id: string) => {
    return useQuery({
      queryKey: ['competencies', id],
      queryFn: () => competencyService.getCompetencyById(id),
    });
  };

  // Get competencies by subject ID
  const getCompetenciesBySubjectId = (subjectId: string) => {
    return useQuery({
      queryKey: ['competencies', 'subject', subjectId],
      queryFn: () => competencyService.getCompetenciesBySubjectId(subjectId),
      enabled: !!subjectId,
    });
  };

  // Create competency
  const createCompetency = useMutation({
    mutationFn: (competency: CreateCompetencyDto) => competencyService.createCompetency(competency),
    onSuccess: (newCompetency, variables) => {
      // Immediately update the cache with the new competency
      queryClient.setQueryData(['competencies'], (oldData: any) => {
        return oldData ? [...oldData, newCompetency] : [newCompetency];
      });
      
      // Update subject-specific competency cache
      queryClient.setQueryData(['competencies', 'subject', variables.subjectId], (oldData: any) => {
        return oldData ? [...oldData, newCompetency] : [newCompetency];
      });
      
      // Then invalidate to ensure consistency with server
      queryClient.invalidateQueries({ queryKey: ['competencies'] });
      queryClient.invalidateQueries({ queryKey: ['competencies', 'subject', variables.subjectId] });
    },
  });

  // Update competency
  const updateCompetency = useMutation({
    mutationFn: ({ id, competency }: { id: string; competency: UpdateCompetencyDto }) => 
      competencyService.updateCompetency(id, competency),
    onSuccess: (updatedCompetency, { id }) => {
      // Immediately update the cache with the updated competency
      queryClient.setQueryData(['competencies'], (oldData: any) => {
        if (!oldData) return [];
        return oldData.map((item: any) => item.id === id ? updatedCompetency : item);
      });
      
      // If we know the subject ID, update that cache too
      if (updatedCompetency.subjectId) {
        queryClient.setQueryData(['competencies', 'subject', updatedCompetency.subjectId], (oldData: any) => {
          if (!oldData) return [];
          return oldData.map((item: any) => item.id === id ? updatedCompetency : item);
        });
      }
      
      // Then invalidate to ensure consistency with server
      queryClient.invalidateQueries({ queryKey: ['competencies'] });
    },
  });

  // Delete competency
  const deleteCompetency = useMutation({
    mutationFn: (id: string) => competencyService.deleteCompetency(id),
    onMutate: async (deletedId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['competencies'] });
      
      // Snapshot the previous values
      const previousCompetencies = queryClient.getQueryData(['competencies']);
      
      // Find which subject this competency belongs to before deleting
      const allCompetencies = queryClient.getQueryData(['competencies']) as any[] || [];
      const deletedCompetency = allCompetencies.find(comp => comp.id === deletedId);
      const subjectId = deletedCompetency?.subjectId;
      
      // Store previous subject-specific competencies if available
      let previousSubjectCompetencies = null;
      if (subjectId) {
        previousSubjectCompetencies = queryClient.getQueryData(['competencies', 'subject', subjectId]);
      }
      
      // Optimistically update to the new value
      queryClient.setQueryData(['competencies'], (oldData: any) => {
        return oldData ? oldData.filter((competency: any) => competency.id !== deletedId) : [];
      });
      
      // Update subject-specific competency cache if we found the subject
      if (subjectId) {
        queryClient.setQueryData(['competencies', 'subject', subjectId], (oldData: any) => {
          return oldData ? oldData.filter((competency: any) => competency.id !== deletedId) : [];
        });
      }
      
      // Return a context object with the snapshots
      return { previousCompetencies, previousSubjectCompetencies, subjectId };
    },
    onError: (err, deletedId, context: any) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(['competencies'], context.previousCompetencies);
      
      if (context.subjectId && context.previousSubjectCompetencies) {
        queryClient.setQueryData(
          ['competencies', 'subject', context.subjectId], 
          context.previousSubjectCompetencies
        );
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['competencies'] });
    },
  });

  return {
    competencies,
    isLoading,
    error,
    getCompetency,
    getCompetenciesBySubjectId,
    createCompetency,
    updateCompetency,
    deleteCompetency,
  };
};
