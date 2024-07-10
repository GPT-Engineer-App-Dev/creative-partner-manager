import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDesignPartners } from "@/integrations/supabase";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Dashboard = () => {
  const { data: partners, isLoading, isError } = useDesignPartners();
  const [orderedPartners, setOrderedPartners] = useState([]);

  useState(() => {
    if (partners) {
      setOrderedPartners(partners);
    }
  }, [partners]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading dashboard data</div>;

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(orderedPartners);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setOrderedPartners(items);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Design Partners Dashboard</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="partners">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orderedPartners.map((partner, index) => (
                <Draggable key={partner.id} draggableId={partner.id.toString()} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle>{partner.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>Email: {partner.email}</p>
                          <p>Stage: {partner.stage}</p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Dashboard;