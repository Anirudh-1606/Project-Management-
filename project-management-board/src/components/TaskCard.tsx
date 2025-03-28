import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  LinearProgress,
  Tooltip,
  Fade,
} from "@mui/material";
import { format } from "date-fns";
import { Task } from "../types";
import { Draggable } from "react-beautiful-dnd";
import { formatTime } from "../utils/time";

interface TaskCardProps {
  task: Task;
  index: number;
}

const priorityColors = {
  LOW: "success",
  MEDIUM: "warning",
  HIGH: "error",
} as const;

const TaskCard: React.FC<TaskCardProps> = ({ task, index }) => {
  const progress = (task.actualTime / task.estimatedTime) * 100;
  const isOverdue = task.dueDate < new Date() && task.status !== "DONE";

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Fade in timeout={300}>
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            sx={{
              mb: 2,
              cursor: "grab",
              backgroundColor: snapshot.isDragging ? "#e3f2fd" : "white",
              transition: "all 0.2s ease",
              transform: snapshot.isDragging ? "scale(1.02)" : "scale(1)",
              boxShadow: snapshot.isDragging ? 3 : 1,
              border: isOverdue ? "1px solid #f44336" : "none",
              "&:hover": {
                boxShadow: 3,
                transform: "translateY(-2px)",
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
                <Tooltip title={`Priority: ${task.priority}`}>
                  <Chip
                    label={task.priority}
                    color={priorityColors[task.priority]}
                    size="small"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 500,
                    }}
                  />
                </Tooltip>
                <Tooltip title={`Assigned to: ${task.assignee}`}>
                  <Chip
                    label={task.assignee}
                    variant="outlined"
                    size="small"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 500,
                    }}
                  />
                </Tooltip>
              </Box>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  letterSpacing: "-0.5px",
                  fontSize: "1rem",
                  mb: 1,
                }}
              >
                {task.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                gutterBottom
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.875rem",
                  lineHeight: 1.5,
                }}
              >
                {task.description}
              </Typography>
              <Box sx={{ mb: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(progress, 100)}
                  color={progress > 100 ? "error" : "warning"}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: "rgba(255, 167, 38, 0.1)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#ff9800",
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                  }}
                >
                  {formatTime(task.actualTime)} /{" "}
                  {formatTime(task.estimatedTime)}
                </Typography>
              </Box>
              <Typography
                variant="caption"
                color={isOverdue ? "error" : "text.secondary"}
                sx={{
                  display: "block",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                }}
              >
                Due:{" "}
                {task.dueDate instanceof Date
                  ? format(task.dueDate, "MMM dd, yyyy")
                  : "No due date"}
              </Typography>
            </CardContent>
          </Card>
        </Fade>
      )}
    </Draggable>
  );
};

export default TaskCard;
