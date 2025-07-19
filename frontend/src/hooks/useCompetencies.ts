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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['competencies'] });
      queryClient.invalidateQueries({ queryKey: ['competencies', 'subject', variables.subjectId] });
    },
  });

  // Update competency
  const updateCompetency = useMutation({
    mutationFn: ({ id, competency }: { id: string; competency: UpdateCompetencyDto }) => 
      competencyService.updateCompetency(id, competency),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competencies'] });
    },
  });

  // Delete competency
  const deleteCompetency = useMutation({
    mutationFn: (id: string) => competencyService.deleteCompetency(id),
    onSuccess: () => {
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
