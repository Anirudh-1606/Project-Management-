import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  LinearProgress,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import { format } from "date-fns";
import { Task, WorkLog } from "../types";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { v4 as uuidv4 } from "uuid";
import { formatTime } from "../utils/time";
import TaskDependencies from "./TaskDependencies";
import TaskComments from "./TaskComments";

interface TaskDetailsProps {
  task: Task | null;
  onClose: () => void;
  onUpdateTask: (task: Task) => void;
  allTasks: Task[];
}

const TaskDetails: React.FC<TaskDetailsProps> = ({
  task,
  onClose,
  onUpdateTask,
  allTasks,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [newWorkLog, setNewWorkLog] = useState({
    description: "",
    timeSpent: "",
  });

  if (!task) return null;

  const handleEdit = () => {
    setEditedTask({ ...task });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedTask) {
      onUpdateTask(editedTask);
      setIsEditing(false);
      setEditedTask(null);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTask(null);
  };

  const handleAddDependency = (taskId: string) => {
    if (!isEditing) {
      setIsEditing(true);
      setEditedTask({ ...task });
    }
    if (editedTask) {
      setEditedTask({
        ...editedTask,
        dependencies: [...editedTask.dependencies, taskId],
      });
    }
  };

  const handleRemoveDependency = (taskId: string) => {
    if (!isEditing) {
      setIsEditing(true);
      setEditedTask({ ...task });
    }
    if (editedTask) {
      setEditedTask({
        ...editedTask,
        dependencies: editedTask.dependencies.filter((id) => id !== taskId),
      });
    }
  };

  const handleAddComment = (content: string, attachments: string[]) => {
    if (!isEditing) {
      setIsEditing(true);
      setEditedTask({ ...task });
    }
    if (editedTask) {
      const newComment = {
        id: uuidv4(),
        content,
        author: "Current User", // TODO: Replace with actual user
        createdAt: new Date(),
        attachments,
      };
      setEditedTask({
        ...editedTask,
        comments: [...editedTask.comments, newComment],
      });
    }
  };

  const handleAddWorkLog = () => {
    if (!isEditing) {
      setIsEditing(true);
      setEditedTask({ ...task });
    }
    if (!editedTask) return;

    const workLog: WorkLog = {
      id: uuidv4(),
      startTime: new Date(),
      endTime: new Date(),
      duration: parseInt(newWorkLog.timeSpent),
      timeSpent: parseInt(newWorkLog.timeSpent),
      description: newWorkLog.description,
    };

    setEditedTask({
      ...editedTask,
      workLogs: [...editedTask.workLogs, workLog],
      actualTime: editedTask.actualTime + workLog.timeSpent,
    });

    setNewWorkLog({ description: "", timeSpent: "" });
  };

  const handleDeleteWorkLog = (logId: string) => {
    if (!isEditing) {
      setIsEditing(true);
      setEditedTask({ ...task });
    }
    if (editedTask) {
      const logToDelete = editedTask.workLogs.find((log) => log.id === logId);
      if (logToDelete) {
        setEditedTask({
          ...editedTask,
          workLogs: editedTask.workLogs.filter((l) => l.id !== logId),
          actualTime: editedTask.actualTime - logToDelete.timeSpent,
        });
      }
    }
  };

  const currentTask = editedTask || task;
  const progress = (currentTask.actualTime / currentTask.estimatedTime) * 100;

  return (
    <Dialog
      open={!!task}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 600,
          letterSpacing: "-0.5px",
          fontSize: "1.25rem",
        }}
      >
        Task Details
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: "background.default",
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: "1.1rem",
              }}
            >
              {currentTask.title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                color: "text.secondary",
                mb: 2,
              }}
            >
              {currentTask.description}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip
                label={currentTask.priority}
                color={
                  currentTask.priority === "HIGH"
                    ? "error"
                    : currentTask.priority === "MEDIUM"
                    ? "warning"
                    : "success"
                }
                size="small"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                }}
              />
              <Chip
                label={currentTask.status}
                variant="outlined"
                size="small"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                }}
              />
            </Stack>
            <List dense>
              <ListItem>
                <PersonIcon sx={{ mr: 1, color: "text.secondary" }} />
                <ListItemText
                  primary="Assignee"
                  secondary={currentTask.assignee}
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "0.875rem",
                      color: "text.secondary",
                    },
                    "& .MuiListItemText-secondary": {
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 500,
                    },
                  }}
                />
              </ListItem>
              <ListItem>
                <CalendarTodayIcon sx={{ mr: 1, color: "text.secondary" }} />
                <ListItemText
                  primary="Due Date"
                  secondary={format(
                    new Date(currentTask.dueDate),
                    "MMM dd, yyyy"
                  )}
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "0.875rem",
                      color: "text.secondary",
                    },
                    "& .MuiListItemText-secondary": {
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 500,
                    },
                  }}
                />
              </ListItem>
              <ListItem>
                <AccessTimeIcon sx={{ mr: 1, color: "text.secondary" }} />
                <ListItemText
                  primary="Time"
                  secondary={`${formatTime(
                    currentTask.actualTime
                  )} / ${formatTime(currentTask.estimatedTime)}`}
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "0.875rem",
                      color: "text.secondary",
                    },
                    "& .MuiListItemText-secondary": {
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 500,
                    },
                  }}
                />
              </ListItem>
            </List>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 2,
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
              Time Progress
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Box sx={{ flexGrow: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(progress, 100)}
                  color={progress > 100 ? "error" : "warning"}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "rgba(255, 167, 38, 0.1)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#ff9800",
                    },
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "block",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                }}
              >
                {formatTime(currentTask.actualTime)} /{" "}
                {formatTime(currentTask.estimatedTime)}
              </Typography>
            </Box>
          </Paper>

          <TaskDependencies
            task={currentTask}
            allTasks={allTasks}
            onAddDependency={handleAddDependency}
            onRemoveDependency={handleRemoveDependency}
          />

          <TaskComments
            task={currentTask}
            currentUser="Current User" // TODO: Replace with actual user
            onAddComment={handleAddComment}
          />

          <Paper
            elevation={0}
            sx={{
              p: 2,
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
              Work Logs
            </Typography>
            <List>
              {currentTask.workLogs.map((log) => (
                <ListItem
                  key={log.id}
                  sx={{
                    bgcolor: "background.default",
                    borderRadius: 1,
                    mb: 1,
                  }}
                  secondaryAction={
                    isEditing && (
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        size="small"
                        onClick={() => handleDeleteWorkLog(log.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )
                  }
                >
                  <ListItemText
                    primary={log.description}
                    secondary={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <AccessTimeIcon fontSize="small" color="action" />
                        <Typography
                          variant="caption"
                          sx={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {format(log.startTime, "MMM dd, yyyy HH:mm")} -{" "}
                          {log.timeSpent} minutes
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>

            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Work Log Description"
                multiline
                rows={2}
                value={newWorkLog.description}
                onChange={(e) =>
                  setNewWorkLog({ ...newWorkLog, description: e.target.value })
                }
                sx={{ mb: 1 }}
              />
              <TextField
                fullWidth
                label="Time Spent (minutes)"
                type="number"
                value={newWorkLog.timeSpent}
                onChange={(e) =>
                  setNewWorkLog({ ...newWorkLog, timeSpent: e.target.value })
                }
                sx={{ mb: 1 }}
              />
              <Button
                variant="contained"
                onClick={handleAddWorkLog}
                disabled={!newWorkLog.description || !newWorkLog.timeSpent}
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                  textTransform: "none",
                }}
              >
                Add Work Log
              </Button>
            </Box>
          </Paper>
        </Stack>
      </DialogContent>
      <DialogActions>
        {isEditing ? (
          <>
            <Button
              onClick={handleCancel}
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 500,
                textTransform: "none",
                fontSize: "0.875rem",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              color="primary"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 500,
                textTransform: "none",
                fontSize: "0.875rem",
              }}
            >
              Save Changes
            </Button>
          </>
        ) : (
          <Button
            onClick={handleEdit}
            variant="contained"
            color="primary"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 500,
              textTransform: "none",
              fontSize: "0.875rem",
            }}
          >
            Edit Task
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default TaskDetails;
