import { useState } from "react";
import { SubjectCard } from "@/components/SubjectCard";
import { EvaluationStats } from "@/components/EvaluationStats";
import { AddSubjectDialog } from "@/components/AddSubjectDialog";
import { Input } from "@/components/ui/input";
import { Search, BookOpen } from "lucide-react";

interface Competency {
  id: string;
  name: string;
  marks: number;
}

interface Subject {
  id: string;
  name: string;
  description: string;
  competencies: Competency[];
}

const Index = () => {
  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: "1",
      name: "Data Structures",
      description: "Fundamental data structures and algorithms",
      competencies: [
        { id: "1", name: "LinkedLists", marks: 8 },
        { id: "2", name: "Arrays", marks: 7 },
        { id: "3", name: "Trees", marks: 9 },
        { id: "4", name: "Graphs", marks: 10 },
        { id: "5", name: "Stacks", marks: 6 }
      ]
    },
    {
      id: "2",
      name: "Cloud Computing",
      description: "Cloud platforms and distributed computing",
      competencies: [
        { id: "6", name: "AWS Services", marks: 9 },
        { id: "7", name: "Docker", marks: 8 },
        { id: "8", name: "Kubernetes", marks: 10 },
        { id: "9", name: "Microservices", marks: 9 }
      ]
    },
    {
      id: "3",
      name: "Networking",
      description: "Computer networks and protocols",
      competencies: [
        { id: "10", name: "TCP/IP", marks: 8 },
        { id: "11", name: "HTTP/HTTPS", marks: 7 },
        { id: "12", name: "DNS", marks: 6 },
        { id: "13", name: "Load Balancing", marks: 9 }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addSubject = (name: string, description: string) => {
    const newSubject: Subject = {
      id: Date.now().toString(),
      name,
      description,
      competencies: []
    };
    setSubjects([...subjects, newSubject]);
  };

  const deleteSubject = (subjectId: string) => {
    setSubjects(subjects.filter(subject => subject.id !== subjectId));
  };

  const updateSubject = (subjectId: string, name: string, description: string) => {
    setSubjects(subjects.map(subject =>
      subject.id === subjectId
        ? { ...subject, name, description }
        : subject
    ));
  };

  const addCompetency = (subjectId: string, name: string, marks: number) => {
    setSubjects(subjects.map(subject =>
      subject.id === subjectId
        ? {
            ...subject,
            competencies: [
              ...subject.competencies,
              { id: Date.now().toString(), name, marks }
            ]
          }
        : subject
    ));
  };

  const updateCompetency = (subjectId: string, competencyId: string, name: string, marks: number) => {
    setSubjects(subjects.map(subject =>
      subject.id === subjectId
        ? {
            ...subject,
            competencies: subject.competencies.map(comp =>
              comp.id === competencyId ? { ...comp, name, marks } : comp
            )
          }
        : subject
    ));
  };

  const deleteCompetency = (subjectId: string, competencyId: string) => {
    setSubjects(subjects.map(subject =>
      subject.id === subjectId
        ? {
            ...subject,
            competencies: subject.competencies.filter(comp => comp.id !== competencyId)
          }
        : subject
    ));
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
        {/* Stats Section */}
        <div className="mb-8">
          <EvaluationStats subjects={subjects} />
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
      </div>
    </div>
  );
};

export default Index;
