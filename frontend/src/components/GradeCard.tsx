import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit3, Save, X } from "lucide-react";
import { useState } from "react";

interface Student {
  id: string;
  name: string;
  email: string;
  grades: { [assignment: string]: number };
}

interface GradeCardProps {
  student: Student;
  assignments: string[];
  onUpdateGrade: (studentId: string, assignment: string, grade: number) => void;
}

export function GradeCard({ student, assignments, onUpdateGrade }: GradeCardProps) {
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const calculateAverage = () => {
    const grades = Object.values(student.grades);
    if (grades.length === 0) return 0;
    return grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
  };

  const getGradeLetter = (grade: number) => {
    if (grade >= 90) return "A";
    if (grade >= 80) return "B";
    if (grade >= 70) return "C";
    if (grade >= 60) return "D";
    return "F";
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "grade-a";
    if (grade >= 80) return "grade-b";
    if (grade >= 70) return "grade-c";
    if (grade >= 60) return "grade-d";
    return "grade-f";
  };

  const handleEditStart = (assignment: string, currentGrade: number) => {
    setEditMode(assignment);
    setEditValue(currentGrade.toString());
  };

  const handleSave = (assignment: string) => {
    const newGrade = parseFloat(editValue);
    if (!isNaN(newGrade) && newGrade >= 0 && newGrade <= 100) {
      onUpdateGrade(student.id, assignment, newGrade);
    }
    setEditMode(null);
    setEditValue("");
  };

  const handleCancel = () => {
    setEditMode(null);
    setEditValue("");
  };

  const average = calculateAverage();

  return (
    <Card className="bg-gradient-card shadow-card border-0 hover:shadow-elevated transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">{student.name}</CardTitle>
            <p className="text-muted-foreground text-sm">{student.email}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">{average.toFixed(1)}%</div>
            <Badge 
              className={`bg-${getGradeColor(average)} text-white font-semibold`}
            >
              {getGradeLetter(average)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {assignments.map((assignment) => {
            const grade = student.grades[assignment] || 0;
            const isEditing = editMode === assignment;

            return (
              <div key={assignment} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <span className="font-medium text-secondary-foreground">{assignment}</span>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-20 h-8"
                        type="number"
                        min="0"
                        max="100"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSave(assignment)}
                        className="h-8 w-8 p-0"
                      >
                        <Save className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Badge 
                        className={`bg-${getGradeColor(grade)} text-white font-semibold`}
                      >
                        {grade}%
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditStart(assignment, grade)}
                        className="h-8 w-8 p-0 hover:bg-primary/10"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}