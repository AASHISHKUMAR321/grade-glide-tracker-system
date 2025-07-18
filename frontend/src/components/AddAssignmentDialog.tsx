import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";

interface AddAssignmentDialogProps {
  onAddAssignment: (assignment: string) => void;
}

export function AddAssignmentDialog({ onAddAssignment }: AddAssignmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [assignment, setAssignment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (assignment.trim()) {
      onAddAssignment(assignment.trim());
      setAssignment("");
      setOpen(false);
    }
};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="shadow-card">
          <BookOpen className="mr-2 h-4 w-4" />
          Add Assignment
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gradient-card border-0 shadow-elevated">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">Add New Assignment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="assignment" className="text-sm font-medium text-foreground">
              Assignment Name
            </Label>
            <Input
              id="assignment"
              value={assignment}
              onChange={(e) => setAssignment(e.target.value)}
              placeholder="Enter assignment name"
              className="w-full"
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-success"
            >
              Add Assignment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}