import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDesignPartners, useAddDesignPartner, useUpdateDesignPartner, useDeleteDesignPartner } from "@/integrations/supabase";
import { useForm } from "react-hook-form";

const Partners = () => {
  const { data: partners, isLoading, isError } = useDesignPartners();
  const addPartner = useAddDesignPartner();
  const updatePartner = useUpdateDesignPartner();
  const deletePartner = useDeleteDesignPartner();

  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedPartners = partners ? [...partners].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  }) : [];

  const onSubmit = async (data) => {
    await addPartner.mutateAsync(data);
    setIsAddDialogOpen(false);
    reset();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this partner?")) {
      await deletePartner.mutateAsync(id);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading partners</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Design Partners</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Partner</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Partner</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Partner Name</Label>
                <Input id="name" {...register("name", { required: true })} placeholder="Enter partner name" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" {...register("email", { required: true })} placeholder="Enter partner email" type="email" />
              </div>
              <div>
                <Label htmlFor="stage">Current Stage</Label>
                <Select {...register("stage", { required: true })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="Testing">Testing</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">Add Partner</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort("name")} className="cursor-pointer">
              Name {sortColumn === "name" && (sortDirection === "asc" ? "▲" : "▼")}
            </TableHead>
            <TableHead onClick={() => handleSort("email")} className="cursor-pointer">
              Email {sortColumn === "email" && (sortDirection === "asc" ? "▲" : "▼")}
            </TableHead>
            <TableHead onClick={() => handleSort("stage")} className="cursor-pointer">
              Stage {sortColumn === "stage" && (sortDirection === "asc" ? "▲" : "▼")}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPartners.map((partner) => (
            <TableRow key={partner.id}>
              <TableCell>{partner.name}</TableCell>
              <TableCell>{partner.email}</TableCell>
              <TableCell>{partner.stage}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2">
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(partner.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Partners;