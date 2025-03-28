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
  Paper,
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
      <DialogTitle
        sx={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 600,
          letterSpacing: "-0.5px",
          fontSize: "1.25rem",
        }}
      >
        Board Configuration
      </DialogTitle>
      <DialogContent>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            bgcolor: "background.default",
            borderRadius: 2,
          }}
        >
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              color: "text.primary",
              fontSize: "0.875rem",
            }}
          >
            Add New Stage
          </Typography>
          <TextField
            fullWidth
            label="Stage ID"
            value={newStage.id}
            onChange={(e) => setNewStage({ ...newStage, id: e.target.value })}
            sx={{
              mb: 1,
              "& .MuiInputLabel-root": { fontFamily: "'Poppins', sans-serif" },
              "& .MuiInputBase-root": { fontFamily: "'Poppins', sans-serif" },
            }}
          />
          <TextField
            fullWidth
            label="Stage Title"
            value={newStage.title}
            onChange={(e) =>
              setNewStage({ ...newStage, title: e.target.value })
            }
            sx={{
              mb: 1,
              "& .MuiInputLabel-root": { fontFamily: "'Poppins', sans-serif" },
              "& .MuiInputBase-root": { fontFamily: "'Poppins', sans-serif" },
            }}
          />
          <Button
            variant="contained"
            onClick={handleAddStage}
            disabled={
              !newStage.id ||
              !newStage.title ||
              !!columns.find((col) => col.id === newStage.id)
            }
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 500,
              textTransform: "none",
              fontSize: "0.875rem",
            }}
          >
            Add Stage
          </Button>
        </Paper>

        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            color: "text.primary",
            fontSize: "1rem",
          }}
        >
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
                        sx={{
                          bgcolor: "background.default",
                          borderRadius: 1,
                          mb: 1,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            bgcolor: "action.hover",
                          },
                        }}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleRemoveStage(column.id)}
                            disabled={column.tasks.length > 0}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={column.title}
                          secondary={`${column.tasks.length} tasks`}
                          sx={{
                            "& .MuiListItemText-primary": {
                              fontFamily: "'Poppins', sans-serif",
                              fontWeight: 500,
                              fontSize: "0.875rem",
                            },
                            "& .MuiListItemText-secondary": {
                              fontFamily: "'Poppins', sans-serif",
                              color: "text.secondary",
                              fontSize: "0.75rem",
                            },
                          }}
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
        <Button
          onClick={onClose}
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 500,
            textTransform: "none",
            fontSize: "0.875rem",
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BoardConfig;
