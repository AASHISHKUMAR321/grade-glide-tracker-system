import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, Target } from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  grades: { [assignment: string]: number };
}

interface GradeStatsProps {
  students: Student[];
  assignments: string[];
}

export function GradeStats({ students, assignments }: GradeStatsProps) {
  const calculateClassAverage = () => {
    if (students.length === 0) return 0;
    const totalAverage = students.reduce((sum, student) => {
      const grades = Object.values(student.grades);
      const studentAverage = grades.length > 0 ? grades.reduce((a, b) => a + b, 0) / grades.length : 0;
      return sum + studentAverage;
    }, 0);
    return totalAverage / students.length;
  };

  const getGradeDistribution = () => {
    const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    
    students.forEach(student => {
      const grades = Object.values(student.grades);
      const average = grades.length > 0 ? grades.reduce((a, b) => a + b, 0) / grades.length : 0;
      
      if (average >= 90) distribution.A++;
      else if (average >= 80) distribution.B++;
      else if (average >= 70) distribution.C++;
      else if (average >= 60) distribution.D++;
      else distribution.F++;
    });
    
    return distribution;
  };

  const getHighestPerformer = () => {
    if (students.length === 0) return null;
    
    return students.reduce((highest, student) => {
      const grades = Object.values(student.grades);
      const average = grades.length > 0 ? grades.reduce((a, b) => a + b, 0) / grades.length : 0;
      
      const highestGrades = Object.values(highest.grades);
      const highestAverage = highestGrades.length > 0 ? highestGrades.reduce((a, b) => a + b, 0) / highestGrades.length : 0;
      
      return average > highestAverage ? student : highest;
    });
  };

  const getNeedsAttention = () => {
    return students.filter(student => {
      const grades = Object.values(student.grades);
      const average = grades.length > 0 ? grades.reduce((a, b) => a + b, 0) / grades.length : 0;
      return average < 70;
    });
  };

  const classAverage = calculateClassAverage();
  const distribution = getGradeDistribution();
  const highestPerformer = getHighestPerformer();
  const needsAttention = getNeedsAttention();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Class Average */}
      <Card className="bg-gradient-primary text-primary-foreground border-0 shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="h-4 w-4" />
            Class Average
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{classAverage.toFixed(1)}%</div>
          <p className="text-primary-foreground/80 text-sm">
            {classAverage >= 80 ? "Excellent performance" : classAverage >= 70 ? "Good performance" : "Needs improvement"}
          </p>
        </CardContent>
      </Card>

      {/* Total Students */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Total Students
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">{students.length}</div>
          <p className="text-muted-foreground text-sm">
            Enrolled students
          </p>
        </CardContent>
      </Card>

      {/* Highest Performer */}
      <Card className="bg-gradient-success text-accent-foreground border-0 shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Top Performer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold truncate">
            {highestPerformer ? highestPerformer.name : "No data"}
          </div>
          <p className="text-accent-foreground/80 text-sm">
            {highestPerformer ? `${Object.values(highestPerformer.grades).length > 0 ? 
              (Object.values(highestPerformer.grades).reduce((a, b) => a + b, 0) / Object.values(highestPerformer.grades).length).toFixed(1) : 0}% average` : ""}
          </p>
        </CardContent>
      </Card>

      {/* Needs Attention */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-destructive" />
            Needs Attention
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">{needsAttention.length}</div>
          <p className="text-muted-foreground text-sm">
            Students below 70%
          </p>
        </CardContent>
      </Card>

      {/* Grade Distribution */}
      <Card className="bg-gradient-card shadow-card border-0 md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Grade Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {Object.entries(distribution).map(([grade, count]) => (
              <div key={grade} className="flex items-center gap-2">
                <Badge 
                  className={`
                    ${grade === 'A' ? 'bg-grade-a' : ''}
                    ${grade === 'B' ? 'bg-grade-b' : ''}
                    ${grade === 'C' ? 'bg-grade-c' : ''}
                    ${grade === 'D' ? 'bg-grade-d' : ''}
                    ${grade === 'F' ? 'bg-grade-f' : ''}
                    text-white font-semibold px-3 py-1
                  `}
                >
                  {grade}
                </Badge>
                <span className="font-medium text-foreground">{count} students</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}