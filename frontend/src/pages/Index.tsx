import { useState, useEffect } from "react";
import { SubjectCard } from "@/components/SubjectCard";
import { EvaluationStats } from "@/components/EvaluationStats";
import { AddSubjectDialog } from "@/components/AddSubjectDialog";
import { Input } from "@/components/ui/input";
import { Search, BookOpen } from "lucide-react";
import { useSubjects } from "@/hooks/useSubjects";
import { useCompetencies } from "@/hooks/useCompetencies";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Subject as ApiSubject, Competency as ApiCompetency } from "@/types/models";
import { Spinner } from "@/components/ui/spinner";

// Define local interfaces that match the component expectations
interface Competency extends ApiCompetency {}

interface Subject extends ApiSubject {
  competencies: Competency[];
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Wrapper component with QueryClientProvider
const IndexWithProvider = () => (
  <QueryClientProvider client={queryClient}>
    <Index />
  </QueryClientProvider>
);

const Index = () => {
  // Use our custom hooks for subjects and competencies
  const { 
    subjects = [], 
    isLoading: isLoadingSubjects, 
    error: subjectsError,
    createSubject,
    updateSubject: updateSubjectMutation,
    deleteSubject: deleteSubjectMutation
  } = useSubjects();
  
  const {
    competencies = [],
    createCompetency,
    updateCompetency: updateCompetencyMutation,
    deleteCompetency: deleteCompetencyMutation
  } = useCompetencies();

  // Local state for search
  const [searchTerm, setSearchTerm] = useState("");
  
  // Prepare subjects with their competencies
  const [enrichedSubjects, setEnrichedSubjects] = useState<Subject[]>([]);

  // Enrich subjects with their competencies
  useEffect(() => {
    if (subjects.length > 0 && competencies.length > 0) {
      const enriched = subjects.map(subject => ({
        ...subject,
        competencies: competencies.filter(comp => comp.subjectId === subject.id)
      })) as Subject[];
      setEnrichedSubjects(enriched);
    } else if (subjects.length > 0) {
      setEnrichedSubjects(subjects.map(subject => ({ ...subject, competencies: [] })) as Subject[]);
    }
  }, [subjects, competencies]);

  // Filter subjects based on search term
  const filteredSubjects = enrichedSubjects.filter(subject =>
    subject.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handler functions that use our API services
  const addSubject = async (name: string, description: string) => {
    try {
      await createSubject.mutateAsync({ name, description });
    } catch (error) {
      console.error("Failed to create subject:", error);
    }
  };

  const deleteSubject = async (subjectId: string) => {
    try {
      await deleteSubjectMutation.mutateAsync(subjectId);
    } catch (error) {
      console.error("Failed to delete subject:", error);
    }
  };

  const updateSubject = async (subjectId: string, name: string, description: string) => {
    try {
      await updateSubjectMutation.mutateAsync({ 
        id: subjectId, 
        subject: { name, description } 
      });
    } catch (error) {
      console.error("Failed to update subject:", error);
    }
  };

  const addCompetency = async (subjectId: string, name: string, marks: number) => {
    try {
      await createCompetency.mutateAsync({ 
        name, 
        marks, 
        subjectId 
      });
    } catch (error) {
      console.error("Failed to create competency:", error);
    }
  };

  const updateCompetency = async (subjectId: string, competencyId: string, name: string, marks: number) => {
    try {
      await updateCompetencyMutation.mutateAsync({ 
        id: competencyId, 
        competency: { name, marks } 
      });
    } catch (error) {
      console.error("Failed to update competency:", error);
    }
  };

  const deleteCompetency = async (subjectId: string, competencyId: string) => {
    try {
      await deleteCompetencyMutation.mutateAsync(competencyId);
    } catch (error) {
      console.error("Failed to delete competency:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground shadow-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8" />
              <div>
                <h1 className="text-3xl font-bold">Evaluation Management System</h1>
                <p className="text-primary-foreground/80">Create subjects and manage competency evaluations</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AddSubjectDialog onAddSubject={addSubject} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {isLoadingSubjects && (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
            <span className="ml-2">Loading subjects...</span>
          </div>
        )}

        {/* Error State */}
        {subjectsError && (
          <div className="text-center py-12 text-destructive">
            <p>Error loading subjects. Please try again later.</p>
          </div>
        )}

        {/* Content when loaded */}
        {!isLoadingSubjects && !subjectsError && (
          <>
            {/* Stats Section */}
            <div className="mb-8">
              <EvaluationStats subjects={enrichedSubjects as any} />
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search subjects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Subjects Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredSubjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  onDeleteSubject={deleteSubject}
                  onUpdateSubject={updateSubject}
                  onAddCompetency={addCompetency}
                  onUpdateCompetency={updateCompetency}
                  onDeleteCompetency={deleteCompetency}
                />
              ))}
            </div>

            {filteredSubjects.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground text-lg">No subjects found</div>
                <p className="text-muted-foreground">Try adjusting your search or add a new subject</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default IndexWithProvider;
