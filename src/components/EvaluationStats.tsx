import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Target, Award, TrendingUp } from "lucide-react";

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

interface EvaluationStatsProps {
  subjects: Subject[];
}

export function EvaluationStats({ subjects }: EvaluationStatsProps) {
  const totalSubjects = subjects.length;
  const totalCompetencies = subjects.reduce((sum, subject) => sum + subject.competencies.length, 0);
  const totalMarks = subjects.reduce((sum, subject) => 
    sum + subject.competencies.reduce((compSum, comp) => compSum + comp.marks, 0), 0
  );
  const averageMarksPerCompetency = totalCompetencies > 0 ? totalMarks / totalCompetencies : 0;

  const getHighestValuedSubject = () => {
    if (subjects.length === 0) return null;
    
    return subjects.reduce((highest, subject) => {
      const subjectTotal = subject.competencies.reduce((sum, comp) => sum + comp.marks, 0);
      const highestTotal = highest.competencies.reduce((sum, comp) => sum + comp.marks, 0);
      return subjectTotal > highestTotal ? subject : highest;
    });
  };

  const getSubjectDistribution = () => {
    const distribution: { [key: string]: number } = {};
    subjects.forEach(subject => {
      const competencyCount = subject.competencies.length;
      if (competencyCount === 0) distribution["0 competencies"] = (distribution["0 competencies"] || 0) + 1;
      else if (competencyCount <= 3) distribution["1-3 competencies"] = (distribution["1-3 competencies"] || 0) + 1;
      else if (competencyCount <= 6) distribution["4-6 competencies"] = (distribution["4-6 competencies"] || 0) + 1;
      else distribution["7+ competencies"] = (distribution["7+ competencies"] || 0) + 1;
    });
    return distribution;
  };

  const highestValuedSubject = getHighestValuedSubject();
  const distribution = getSubjectDistribution();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Subjects */}
      <Card className="bg-gradient-primary text-primary-foreground border-0 shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Total Subjects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalSubjects}</div>
          <p className="text-primary-foreground/80 text-sm">
            Active evaluation subjects
          </p>
        </CardContent>
      </Card>

      {/* Total Competencies */}
      <Card className="bg-gradient-success text-accent-foreground border-0 shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="h-4 w-4" />
            Total Competencies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalCompetencies}</div>
          <p className="text-accent-foreground/80 text-sm">
            Evaluation criteria defined
          </p>
        </CardContent>
      </Card>

      {/* Total Marks */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Award className="h-4 w-4" />
            Total Marks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">{totalMarks}</div>
          <p className="text-muted-foreground text-sm">
            Across all competencies
          </p>
        </CardContent>
      </Card>

      {/* Average Marks */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Average Marks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">{averageMarksPerCompetency.toFixed(1)}</div>
          <p className="text-muted-foreground text-sm">
            Per competency
          </p>
        </CardContent>
      </Card>

      {/* Highest Valued Subject */}
      <Card className="bg-gradient-card shadow-card border-0 md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Highest Valued Subject
          </CardTitle>
        </CardHeader>
        <CardContent>
          {highestValuedSubject ? (
            <div>
              <div className="text-xl font-bold text-foreground mb-2">{highestValuedSubject.name}</div>
              <p className="text-muted-foreground text-sm mb-3">{highestValuedSubject.description}</p>
              <div className="flex items-center gap-4">
                <Badge className="bg-primary text-primary-foreground">
                  {highestValuedSubject.competencies.length} competencies
                </Badge>
                <Badge className="bg-grade-a text-white">
                  {highestValuedSubject.competencies.reduce((sum, comp) => sum + comp.marks, 0)} total marks
                </Badge>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No subjects available</p>
          )}
        </CardContent>
      </Card>

      {/* Subject Distribution */}
      <Card className="bg-gradient-card shadow-card border-0 md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Subject Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(distribution).map(([range, count]) => (
              <div key={range} className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{range}</span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-secondary/30 rounded-full h-2 w-32">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${totalSubjects > 0 ? (count / totalSubjects) * 100 : 0}%` }}
                    />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {count}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}