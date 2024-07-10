import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useForm, Controller } from "react-hook-form";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Partners = () => {
  const { data: partners, isLoading, isError } = useDesignPartners();
  const addPartner = useAddDesignPartner();
  const updatePartner = useUpdateDesignPartner();
  const deletePartner = useDeleteDesignPartner();

  const [columns, setColumns] = useState({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (partners) {
      const newColumns = partners.reduce((acc, partner) => {
        if (!acc[partner.stage]) {
          acc[partner.stage] = [];
        }
        acc[partner.stage].push(partner);
        return acc;
      }, {});
      setColumns(newColumns);
    }
  }, [partners]);

  const onSubmit = async (data) => {
    try {
      await addPartner.mutateAsync(data);
      setIsAddDialogOpen(false);
      reset();
    } catch (error) {
      console.error("Error adding new partner:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this partner?")) {
      await deletePartner.mutateAsync(id);
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const startColumn = columns[source.droppableId];
    const finishColumn = columns[destination.droppableId];

    if (startColumn === finishColumn) {
      const newPartners = Array.from(startColumn);
      const [reorderedPartner] = newPartners.splice(source.index, 1);
      newPartners.splice(destination.index, 0, reorderedPartner);

      const newColumn = {
        ...columns,
        [source.droppableId]: newPartners,
      };

      setColumns(newColumn);
    } else {
      const startPartners = Array.from(startColumn);
      const [movedPartner] = startPartners.splice(source.index, 1);
      const finishPartners = Array.from(finishColumn);
      finishPartners.splice(destination.index, 0, movedPartner);

      const newColumns = {
        ...columns,
        [source.droppableId]: startPartners,
        [destination.droppableId]: finishPartners,
      };

      setColumns(newColumns);

      // Update the partner's stage in the database
      await updatePartner.mutateAsync({
        id: draggableId,
        stage: destination.droppableId,
      });
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
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => <Input id="name" {...field} placeholder="Enter partner name" />}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Controller
                  name="email"
                  control={control}
                  rules={{ required: true, pattern: /^\S+@\S+$/i }}
                  render={({ field }) => <Input id="email" {...field} placeholder="Enter partner email" type="email" />}
                />
              </div>
              <div>
                <Label htmlFor="stage">Current Stage</Label>
                <Controller
                  name="stage"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  )}
                />
              </div>
              <Button type="submit">Add Partner</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(columns).map(([columnId, columnPartners]) => (
            <div key={columnId} className="bg-gray-100 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">{columnId}</h2>
              <Droppable droppableId={columnId}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {columnPartners.map((partner, index) => (
                      <Draggable key={partner.id} draggableId={partner.id.toString()} index={index}>
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white"
                          >
                            <CardHeader>
                              <CardTitle>{partner.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p>{partner.email}</p>
                              <div className="mt-2 flex justify-end space-x-2">
                                <Button variant="outline" size="sm">
                                  Edit
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(partner.id)}>
                                  Delete
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Partners;