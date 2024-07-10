import { useState, useEffect } from "react";
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
import { useDesignPartners, useUpdateDesignPartner } from "@/integrations/supabase";

const Settings = () => {
  const { data: partners, isLoading, isError } = useDesignPartners();
  const updatePartner = useUpdateDesignPartner();
  const [stages, setStages] = useState([]);
  const [newStage, setNewStage] = useState("");

  useEffect(() => {
    if (partners) {
      const uniqueStages = [...new Set(partners.map(partner => partner.stage))];
      setStages(uniqueStages);
    }
  }, [partners]);

  const handleAddStage = async (e) => {
    e.preventDefault();
    if (newStage.trim() !== "") {
      setStages([...stages, newStage.trim()]);
      setNewStage("");
    }
  };

  const handleRemoveStage = async (stageToRemove) => {
    const partnersInStage = partners.filter(partner => partner.stage === stageToRemove);
    if (partnersInStage.length > 0) {
      alert("Cannot remove stage with active partners. Please move or delete partners in this stage first.");
      return;
    }
    setStages(stages.filter(stage => stage !== stageToRemove));
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading settings</div>;

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
                    onClick={() => handleRemoveStage(stage)}
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