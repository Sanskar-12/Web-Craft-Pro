"use client";

import {
  LaneDetail,
  PipelineDetailsWithLanesCardsTagsTickets,
} from "@/lib/types";
import { useModal } from "@/providers/modal-provider";
import { Lane, Ticket } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import { Button } from "../ui/button";
import { Flag, Plus } from "lucide-react";
import CustomModal from "../custommodal/custom-modal";
import LaneForm from "../forms/lane-form";

interface PipelineViewProps {
  lanes: LaneDetail[];
  pipelineId: string;
  subaccountId: string;
  pipelineDetails: PipelineDetailsWithLanesCardsTagsTickets;
  updateLanesOrder: (lanes: Lane[]) => Promise<void>;
  updateTicketsOrder: (tickets: Ticket[]) => Promise<void>;
}

const PipelineView = ({
  lanes,
  pipelineDetails,
  pipelineId,
  subaccountId,
  updateLanesOrder,
  updateTicketsOrder,
}: PipelineViewProps) => {
  const { setOpen } = useModal();
  const router = useRouter();
  const [allLanes, setAllLanes] = useState<LaneDetail[]>([]);

  useEffect(() => {
    setAllLanes(lanes);
  }, [lanes]);

  const handleAddLane=()=>{
    setOpen(
        <CustomModal title=" Create A Lane"
        subheading="Lanes allow you to group tickets">
            <LaneForm
              pipelineId={pipelineId}
            />
        </CustomModal>
    )
  }

  return (
    <DragDropContext onDragEnd={() => {}}>
      <div className="bg-white/60 dark:bg-background/60 rounded-xl p-4 use-automation-zoom-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">{pipelineDetails?.name}</h1>
          <Button className="flex items-center gap-4" onClick={handleAddLane}>
            <Plus size={15} />
            Create Lane
          </Button>
        </div>
        <Droppable
          droppableId="lanes"
          type="lane"
          direction="horizontal"
          key="lanes"
        >
          {
            (provided)=>(
              <div className="flex items-center gap-x-2 overflow-scroll" {...provided.droppableProps}
              ref={provided.innerRef}
              >
                <div className="flex mt-4">
                  {
                    allLanes.map((lane,index)=>(
                      <div key={index}>
                        {/* <PipelineLane/> */}
                      </div>
                    ))
                  }
                  {provided.placeholder}
                </div>
              </div>
            )
          }
        </Droppable>
        {
          allLanes.length==0 && (
            <div className="flex items-center justify-center w-full flex-col">
              <div className="opacity-100">
                <Flag
                    width="100%"
                    height="100%"
                    className="text-muted-foreground"
                />
              </div>
            </div>
          )
        }
      </div>
    </DragDropContext>
  );
};

export default PipelineView;
