import React, { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Checkbox,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import { Task } from "../types";

interface TaskDependenciesProps {
  task: Task;
  allTasks: Task[];
  onAddDependency: (taskId: string) => void;
  onRemoveDependency: (taskId: string) => void;
}

const TaskDependencies: React.FC<TaskDependenciesProps> = ({
  task,
  allTasks,
  onAddDependency,
  onRemoveDependency,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const dependentTasks = allTasks.filter((t) =>
    task.dependencies.includes(t.id)
  );
  const blockingTasks = allTasks.filter((t) =>
    t.dependencies.includes(task.id)
  );
  const availableTasks = allTasks.filter(
    (t) => t.id !== task.id && !task.dependencies.includes(t.id)
  );

  const handleOpenDialog = () => {
    setSelectedTasks([]);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedTasks([]);
  };

  const handleSaveDependencies = () => {
    selectedTasks.forEach((taskId) => onAddDependency(taskId));
    handleCloseDialog();
  };

  const handleToggleTask = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          bgcolor: "background.default",
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <LinkIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography
            variant="subtitle2"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              color: "text.primary",
              fontSize: "0.875rem",
            }}
          >
            Dependencies
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography
            variant="caption"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              color: "text.secondary",
              display: "block",
              mb: 1,
            }}
          >
            Depends on:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {dependentTasks.map((depTask) => (
              <Chip
                key={depTask.id}
                label={depTask.title}
                onDelete={() => onRemoveDependency(depTask.id)}
                deleteIcon={<LinkOffIcon />}
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  "& .MuiChip-deleteIcon": {
                    color: "error.main",
                  },
                }}
              />
            ))}
            <Tooltip title="Add dependency">
              <IconButton size="small" onClick={handleOpenDialog}>
                <LinkIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box>
          <Typography
            variant="caption"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              color: "text.secondary",
              display: "block",
              mb: 1,
            }}
          >
            Blocked by:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {blockingTasks.map((blockTask) => (
              <Chip
                key={blockTask.id}
                label={blockTask.title}
                color="warning"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                }}
              />
            ))}
          </Box>
        </Box>
      </Paper>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            letterSpacing: "-0.5px",
            fontSize: "1.25rem",
          }}
        >
          Add Dependencies
        </DialogTitle>
        <DialogContent>
          <List>
            {availableTasks.map((availableTask) => (
              <ListItem key={availableTask.id} disablePadding>
                <ListItemButton
                  onClick={() => handleToggleTask(availableTask.id)}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <Checkbox
                    checked={selectedTasks.includes(availableTask.id)}
                    sx={{
                      color: "primary.main",
                      "&.Mui-checked": {
                        color: "primary.main",
                      },
                    }}
                  />
                  <ListItemText
                    primary={availableTask.title}
                    secondary={availableTask.description}
                    sx={{
                      "& .MuiListItemText-primary": {
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 500,
                      },
                      "& .MuiListItemText-secondary": {
                        fontFamily: "'Poppins', sans-serif",
                        color: "text.secondary",
                        fontSize: "0.875rem",
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
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
            onClick={handleSaveDependencies}
            variant="contained"
            color="primary"
            disabled={selectedTasks.length === 0}
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 500,
              textTransform: "none",
              fontSize: "0.875rem",
            }}
          >
            Add Dependencies
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskDependencies;
