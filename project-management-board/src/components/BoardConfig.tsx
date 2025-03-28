import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { Column as ColumnType } from "../types";

interface BoardConfigProps {
  open: boolean;
  onClose: () => void;
  columns: ColumnType[];
  onUpdateColumns: (columns: ColumnType[]) => void;
}

const BoardConfig: React.FC<BoardConfigProps> = ({
  open,
  onClose,
  columns,
  onUpdateColumns,
}) => {
  const [newStage, setNewStage] = useState({ id: "", title: "" });

  const handleAddStage = () => {
    if (
      newStage.id &&
      newStage.title &&
      !columns.find((col) => col.id === newStage.id)
    ) {
      onUpdateColumns([...columns, { ...newStage, tasks: [] }]);
      setNewStage({ id: "", title: "" });
    }
  };

  const handleRemoveStage = (stageId: string) => {
    // Don't allow removing stages that have tasks
    const stageToRemove = columns.find((col) => col.id === stageId);
    if (stageToRemove && stageToRemove.tasks.length === 0) {
      onUpdateColumns(columns.filter((col) => col.id !== stageId));
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(columns);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onUpdateColumns(items);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Board Configuration</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Stage ID"
            value={newStage.id}
            onChange={(e) => setNewStage({ ...newStage, id: e.target.value })}
            sx={{ mb: 1 }}
          />
          <TextField
            fullWidth
            label="Stage Title"
            value={newStage.title}
            onChange={(e) =>
              setNewStage({ ...newStage, title: e.target.value })
            }
            sx={{ mb: 1 }}
          />
          <Button
            variant="contained"
            onClick={handleAddStage}
            disabled={
              !newStage.id ||
              !newStage.title ||
              !!columns.find((col) => col.id === newStage.id)
            }
          >
            Add Stage
          </Button>
        </Box>

        <Typography variant="subtitle1" gutterBottom>
          Current Stages
        </Typography>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="stages">
            {(provided) => (
              <List {...provided.droppableProps} ref={provided.innerRef}>
                {columns.map((column, index) => (
                  <Draggable
                    key={column.id}
                    draggableId={column.id}
                    index={index}
                  >
                    {(provided) => (
                      <ListItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleRemoveStage(column.id)}
                            disabled={column.tasks.length > 0}
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={column.title}
                          secondary={`${column.tasks.length} tasks`}
                        />
                      </ListItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BoardConfig;
