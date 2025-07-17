import { useState } from "react";
import { GradeCard } from "@/components/GradeCard";
import { GradeStats } from "@/components/GradeStats";
import { AddStudentDialog } from "@/components/AddStudentDialog";
import { AddAssignmentDialog } from "@/components/AddAssignmentDialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, GraduationCap } from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  grades: { [assignment: string]: number };
}

const Index = () => {
  const [students, setStudents] = useState<Student[]>([
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice.johnson@school.edu",
      grades: {
        "Math Quiz 1": 92,
        "English Essay": 88,
        "Science Test": 95,
        "History Project": 90
      }
    },
    {
      id: "2", 
      name: "Bob Smith",
      email: "bob.smith@school.edu",
      grades: {
        "Math Quiz 1": 78,
        "English Essay": 82,
        "Science Test": 85,
        "History Project": 79
      }
    },
    {
      id: "3",
      name: "Carol Davis",
      email: "carol.davis@school.edu", 
      grades: {
        "Math Quiz 1": 95,
        "English Essay": 91,
        "Science Test": 98,
        "History Project": 94
      }
    },
    {
      id: "4",
      name: "David Wilson",
      email: "david.wilson@school.edu",
      grades: {
        "Math Quiz 1": 65,
        "English Essay": 70,
        "Science Test": 68,
        "History Project": 72
      }
    }
  ]);

  const [assignments, setAssignments] = useState<string[]>([
    "Math Quiz 1",
    "English Essay", 
    "Science Test",
    "History Project"
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addStudent = (name: string, email: string) => {
    const newStudent: Student = {
      id: Date.now().toString(),
      name,
      email,
      grades: {}
    };
    setStudents([...students, newStudent]);
  };

  const addAssignment = (assignment: string) => {
    if (!assignments.includes(assignment)) {
      setAssignments([...assignments, assignment]);
    }
  };

  const updateGrade = (studentId: string, assignment: string, grade: number) => {
    setStudents(students.map(student => 
      student.id === studentId 
        ? { ...student, grades: { ...student.grades, [assignment]: grade } }
        : student
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground shadow-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8" />
              <div>
                <h1 className="text-3xl font-bold">Grade Management System</h1>
                <p className="text-primary-foreground/80">Track and manage student performance</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AddAssignmentDialog onAddAssignment={addAssignment} />
              <AddStudentDialog onAddStudent={addStudent} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <div className="mb-8">
          <GradeStats students={students} assignments={assignments} />
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Assignments:</span>
            <div className="flex flex-wrap gap-2">
              {assignments.map((assignment) => (
                <Badge key={assignment} variant="secondary" className="text-xs">
                  {assignment}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredStudents.map((student) => (
            <GradeCard
              key={student.id}
              student={student}
              assignments={assignments}
              onUpdateGrade={updateGrade}
            />
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg">No students found</div>
            <p className="text-muted-foreground">Try adjusting your search or add a new student</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
