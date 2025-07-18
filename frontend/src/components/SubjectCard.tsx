import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit3, Save, X, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { AddCompetencyDialog } from "@/components/AddCompetencyDialog";

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

interface SubjectCardProps {
  subject: Subject;
  onDeleteSubject: (subjectId: string) => void;
  onUpdateSubject: (subjectId: string, name: string, description: string) => void;
  onAddCompetency: (subjectId: string, name: string, marks: number) => void;
  onUpdateCompetency: (subjectId: string, competencyId: string, name: string, marks: number) => void;
  onDeleteCompetency: (subjectId: string, competencyId: string) => void;
}

export function SubjectCard({ 
  subject, 
  onDeleteSubject, 
  onUpdateSubject,
  onAddCompetency,
  onUpdateCompetency,
  onDeleteCompetency 
}: SubjectCardProps) {
  const [editSubject, setEditSubject] = useState(false);
  const [editCompetency, setEditCompetency] = useState<string | null>(null);
  const [subjectName, setSubjectName] = useState(subject.name);
  const [subjectDescription, setSubjectDescription] = useState(subject.description);
  const [competencyName, setCompetencyName] = useState("");
  const [competencyMarks, setCompetencyMarks] = useState<number>(0);

  const handleSubjectSave = () => {
    onUpdateSubject(subject.id, subjectName, subjectDescription);
    setEditSubject(false);
  };

  const handleSubjectCancel = () => {
    setSubjectName(subject.name);
    setSubjectDescription(subject.description);
    setEditSubject(false);
  };

  const handleCompetencyEdit = (competency: Competency) => {
    setEditCompetency(competency.id);
    setCompetencyName(competency.name);
    setCompetencyMarks(competency.marks);
  };

  const handleCompetencySave = () => {
    if (editCompetency) {
      onUpdateCompetency(subject.id, editCompetency, competencyName, competencyMarks);
      setEditCompetency(null);
      setCompetencyName("");
      setCompetencyMarks(0);
    }
  };

  const handleCompetencyCancel = () => {
    setEditCompetency(null);
    setCompetencyName("");
    setCompetencyMarks(0);
  };

  const totalMarks = subject.competencies.reduce((sum, comp) => sum + comp.marks, 0);
  const averageMarks = subject.competencies.length > 0 ? totalMarks / subject.competencies.length : 0;

  return (
    <Card className="bg-gradient-card shadow-card border-0 hover:shadow-elevated transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {editSubject ? (
              <div className="space-y-2">
                <Input
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="font-semibold text-lg"
                  placeholder="Subject name"
                />
                <Input
                  value={subjectDescription}
                  onChange={(e) => setSubjectDescription(e.target.value)}
                  className="text-sm"
                  placeholder="Subject description"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSubjectSave}>
                    <Save className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleSubjectCancel}>
                    <X className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg font-semibold text-foreground">{subject.name}</CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditSubject(true)}
                    className="h-6 w-6 p-0"
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-muted-foreground text-sm">{subject.description}</p>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Subject</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{subject.name}"? This will also delete all competencies under this subject. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDeleteSubject(subject.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>{subject.competencies.length} competencies</span>
            <span>Total: {totalMarks} marks</span>
            <span>Avg: {averageMarks.toFixed(1)} marks</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground">Competencies</h4>
            <AddCompetencyDialog 
              onAddCompetency={(name, marks) => onAddCompetency(subject.id, name, marks)}
            />
          </div>
          
          {subject.competencies.map((competency) => (
            <div key={competency.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              {editCompetency === competency.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    value={competencyName}
                    onChange={(e) => setCompetencyName(e.target.value)}
                    className="h-8"
                    placeholder="Competency name"
                  />
                  <Input
                    value={competencyMarks}
                    onChange={(e) => setCompetencyMarks(Number(e.target.value))}
                    className="w-20 h-8"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Marks"
                  />
                  <Button size="sm" onClick={handleCompetencySave} className="h-8 w-8 p-0">
                    <Save className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCompetencyCancel} className="h-8 w-8 p-0">
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <>
                  <span className="font-medium text-secondary-foreground">{competency.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary text-primary-foreground font-semibold">
                      {competency.marks} marks
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCompetencyEdit(competency)}
                      className="h-6 w-6 p-0"
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Competency</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{competency.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDeleteCompetency(subject.id, competency.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </>
              )}
            </div>
          ))}
          
          {subject.competencies.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <p>No competencies yet</p>
              <p className="text-sm">Add competencies to define evaluation criteria</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}