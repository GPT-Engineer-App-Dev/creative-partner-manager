import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Settings = () => {
  const [stages, setStages] = useState([
    "Design",
    "Development",
    "Testing",
    "Completed",
  ]);
  const [newStage, setNewStage] = useState("");

  const handleAddStage = (e) => {
    e.preventDefault();
    if (newStage.trim() !== "") {
      setStages([...stages, newStage.trim()]);
      setNewStage("");
    }
  };

  const handleRemoveStage = (index) => {
    setStages(stages.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Configure Design Process Stages</h2>
        <form onSubmit={handleAddStage} className="flex gap-4 mb-4">
          <div className="flex-grow">
            <Label htmlFor="newStage" className="sr-only">
              New Stage
            </Label>
            <Input
              id="newStage"
              placeholder="Enter new stage name"
              value={newStage}
              onChange={(e) => setNewStage(e.target.value)}
            />
          </div>
          <Button type="submit">Add Stage</Button>
        </form>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Stage Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stages.map((stage, index) => (
              <TableRow key={index}>
                <TableCell>{stage}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveStage(index)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Settings;