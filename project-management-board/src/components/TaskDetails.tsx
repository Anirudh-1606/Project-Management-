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
} from "@mui/material";
import { format } from "date-fns";
import { Task, WorkLog } from "../types";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

interface TaskDetailsProps {
  task: Task | null;
  onClose: () => void;
  onUpdateTask: (task: Task) => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({
  task,
  onClose,
  onUpdateTask,
}) => {
  const [newWorkLog, setNewWorkLog] = useState({
    description: "",
    timeSpent: "",
  });

  if (!task) return null;

  const handleAddWorkLog = () => {
    const workLog: WorkLog = {
      id: Math.random().toString(36).substr(2, 9),
      taskId: task.id,
      userId: "current-user",
      timestamp: new Date(),
      description: newWorkLog.description,
      timeSpent: parseInt(newWorkLog.timeSpent),
    };

    const updatedTask = {
      ...task,
      workLogs: [...task.workLogs, workLog],
      actualTime: task.actualTime + workLog.timeSpent,
    };

    onUpdateTask(updatedTask);
    setNewWorkLog({ description: "", timeSpent: "" });
  };

  const progress = (task.actualTime / task.estimatedTime) * 100;

  return (
    <Dialog
      open={!!task}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: "100%", sm: 400 } },
      }}
    >
      <Box sx={{ p: 3, height: "100%", overflow: "auto" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5">{task.title}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip
            label={task.priority}
            color={
              task.priority === "HIGH"
                ? "error"
                : task.priority === "MEDIUM"
                ? "warning"
                : "success"
            }
            size="small"
          />
          <Chip label={task.status} variant="outlined" size="small" />
        </Stack>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Time Progress
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Box sx={{ flexGrow: 1 }}>
              <LinearProgress
                variant="determinate"
                value={Math.min(progress, 100)}
                color={progress > 100 ? "error" : "primary"}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary">
              {task.actualTime}/{task.estimatedTime} min
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" gutterBottom>
          Description
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {task.description}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Details
          </Typography>
          <Typography variant="body2">Assignee: {task.assignee}</Typography>
          <Typography variant="body2">
            Due Date: {format(task.dueDate, "MMM dd, yyyy")}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" gutterBottom>
          Work Logs
        </Typography>
        <List>
          {task.workLogs.map((log) => (
            <ListItem
              key={log.id}
              secondaryAction={
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={log.description}
                secondary={`${format(log.timestamp, "MMM dd, yyyy HH:mm")} - ${
                  log.timeSpent
                } minutes`}
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
          >
            Add Work Log
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default TaskDetails;
