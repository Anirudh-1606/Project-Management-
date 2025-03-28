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
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 3,
        },
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
          <Typography
            variant="h5"
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              letterSpacing: "-0.5px",
            }}
          >
            {task.title}
          </Typography>
          <IconButton onClick={onClose} size="small">
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
            sx={{ fontFamily: "'Roboto', sans-serif", fontWeight: 500 }}
          />
          <Chip
            label={task.status}
            variant="outlined"
            size="small"
            sx={{ fontFamily: "'Roboto', sans-serif", fontWeight: 500 }}
          />
        </Stack>

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
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              color: "text.primary",
            }}
          >
            Time Progress
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Box sx={{ flexGrow: 1 }}>
              <LinearProgress
                variant="determinate"
                value={Math.min(
                  (task.actualTime / task.estimatedTime) * 100,
                  100
                )}
                color={
                  task.actualTime > task.estimatedTime ? "error" : "warning"
                }
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
                mt: 1,
                fontFamily: "'Poppins', sans-serif",
                fontSize: "0.75rem",
                fontWeight: 500,
              }}
            >
              {formatTime(task.actualTime)} / {formatTime(task.estimatedTime)}
            </Typography>
          </Box>
        </Paper>

        <Divider sx={{ my: 2 }} />

        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            color: "text.primary",
          }}
        >
          Description
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          paragraph
          sx={{ fontFamily: "'Roboto', sans-serif" }}
        >
          {task.description}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              color: "text.primary",
            }}
          >
            Details
          </Typography>
          <Stack spacing={1}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PersonIcon fontSize="small" color="action" />
              <Typography
                variant="body2"
                sx={{ fontFamily: "'Roboto', sans-serif" }}
              >
                {task.assignee}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarTodayIcon fontSize="small" color="action" />
              <Typography
                variant="body2"
                sx={{ fontFamily: "'Roboto', sans-serif" }}
              >
                Due: {format(task.dueDate, "MMM dd, yyyy")}
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            color: "text.primary",
          }}
        >
          Work Logs
        </Typography>
        <List>
          {task.workLogs.map((log) => (
            <ListItem
              key={log.id}
              sx={{
                bgcolor: "background.default",
                borderRadius: 1,
                mb: 1,
              }}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" size="small">
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={log.description}
                secondary={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AccessTimeIcon fontSize="small" color="action" />
                    <Typography
                      variant="caption"
                      sx={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      {format(log.timestamp, "MMM dd, yyyy HH:mm")} -{" "}
                      {log.timeSpent} minutes
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            mt: 2,
            bgcolor: "background.default",
            borderRadius: 2,
          }}
        >
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              color: "text.primary",
            }}
          >
            Add Work Log
          </Typography>
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
              fontFamily: "'Roboto', sans-serif",
              fontWeight: 500,
              textTransform: "none",
            }}
          >
            Add Work Log
          </Button>
        </Paper>
      </Box>
    </Dialog>
  );
};

export default TaskDetails;
