import React from "react";
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Stack,
} from "@mui/material";
import { Draggable } from "react-beautiful-dnd";
import { Task } from "../types";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface TaskCardProps {
  task: Task;
  index: number;
  onTaskClick: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onTaskClick }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "error";
      case "MEDIUM":
        return "warning";
      case "LOW":
        return "success";
      default:
        return "default";
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Paper
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          elevation={snapshot.isDragging ? 3 : 1}
          sx={{
            p: 2,
            mb: 2,
            cursor: "grab",
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: 3,
            },
            position: "relative",
            backgroundColor: snapshot.isDragging ? "#e3f2fd" : "white",
          }}
        >
          <Box sx={{ position: "absolute", top: 8, right: 8 }}>
            <Tooltip title="View Details">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onTaskClick(task);
                }}
                sx={{
                  color: "primary.main",
                  "&:hover": {
                    backgroundColor: "primary.light",
                  },
                }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Stack spacing={1}>
            <Typography
              variant="subtitle2"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: "0.875rem",
                pr: 4,
              }}
            >
              {task.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                color: "text.secondary",
                fontSize: "0.75rem",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {task.description}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                label={task.priority}
                size="small"
                color={getPriorityColor(task.priority)}
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.75rem",
                  height: 20,
                }}
              />
              <Chip
                label={task.assignee}
                size="small"
                variant="outlined"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.75rem",
                  height: 20,
                }}
              />
              {task.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "0.75rem",
                    height: 20,
                  }}
                />
              ))}
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  color: "text.secondary",
                  fontSize: "0.75rem",
                }}
              >
                Due: {task.dueDate.toLocaleDateString()}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  color: "text.secondary",
                  fontSize: "0.75rem",
                }}
              >
                {formatTime(task.estimatedTime)}
              </Typography>
            </Box>
          </Stack>
        </Paper>
      )}
    </Draggable>
  );
};

export default TaskCard;
