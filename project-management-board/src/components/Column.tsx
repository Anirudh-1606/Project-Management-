import React from "react";
import { Box, Typography, Paper, Chip, Fade } from "@mui/material";
import { Droppable } from "react-beautiful-dnd";
import { Column as ColumnType, Task } from "../types";
import TaskCard from "./TaskCard";

interface ColumnProps {
  column: ColumnType;
  onTaskClick: (task: Task) => void;
}

const Column: React.FC<ColumnProps> = ({ column, onTaskClick }) => {
  return (
    <Fade in timeout={300}>
      <Paper
        sx={{
          minWidth: 300,
          p: 2,
          backgroundColor: "#f5f5f5",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "#fafafa",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">{column.title}</Typography>
          <Chip
            label={column.tasks.length}
            color="primary"
            size="small"
            sx={{ minWidth: 30 }}
          />
        </Box>
        <Droppable droppableId={column.id} type="TASK">
          {(provided, snapshot) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                minHeight: 100,
                backgroundColor: snapshot.isDraggingOver
                  ? "#e3f2fd"
                  : "transparent",
                transition: "background-color 0.2s ease",
                borderRadius: 1,
                p: 1,
              }}
            >
              {column.tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onClick={onTaskClick}
                />
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </Paper>
    </Fade>
  );
};

export default Column;
