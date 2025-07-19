import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface AddCompetencyDialogProps {
  onAddCompetency: (name: string, marks: number) => void;
}

export function AddCompetencyDialog({ onAddCompetency }: AddCompetencyDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [marks, setMarks] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && marks > 0) {
      onAddCompetency(name.trim(), marks);
      setName("");
      setMarks(0);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="shadow-card">
          <Plus className="mr-1 h-3 w-3" />
          Add Competency
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gradient-card border-0 shadow-elevated">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">Add New Competency</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Define a competency and assign marks for evaluation criteria.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="competency-name" className="text-sm font-medium text-foreground">
              Competency Name
            </Label>
            <Input
              id="competency-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., LinkedLists, Arrays, Docker, TCP/IP"
              className="w-full"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="marks" className="text-sm font-medium text-foreground">
              Marks
            </Label>
            <Input
              id="marks"
              type="number"
              value={marks || ""}
              onChange={(e) => setMarks(Number(e.target.value))}
              placeholder="Enter marks (0-10)"
              className="w-full"
              min="0"
              max="10"
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
              Add Competency
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}