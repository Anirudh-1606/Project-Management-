import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Select,
  FormControl,
  InputLabel,
  Skeleton,
  Fade,
  Typography,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupIcon from "@mui/icons-material/Group";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import { Column as ColumnType, Task, TaskStatus, TaskPriority } from "../types";
import Column from "./Column";
import TaskDetails from "./TaskDetails";
import BoardConfig from "./BoardConfig";
import UserManagement from "./UserManagement";

const defaultColumns: ColumnType[] = [
  {
    id: "TODO",
    title: "To Do",
    tasks: [],
  },
  {
    id: "IN_PROGRESS",
    title: "In Progress",
    tasks: [],
  },
  {
    id: "BLOCKED",
    title: "Blocked",
    tasks: [],
  },
  {
    id: "DONE",
    title: "Done",
    tasks: [],
  },
];

const Board: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState<ColumnType[]>(defaultColumns);
  const [open, setOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [userManagementOpen, setUserManagementOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [assignees, setAssignees] = useState<string[]>([]);
  const [selectedAssignee, setSelectedAssignee] = useState<string>("");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "MEDIUM" as TaskPriority,
    assignee: "",
    dueDate: "",
    estimatedTime: "",
    tags: "",
  });

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceColumn = columns.find((col) => col.id === source.droppableId);
    const destColumn = columns.find(
      (col) => col.id === destination.droppableId
    );

    if (!sourceColumn || !destColumn) return;

    const sourceTasks = [...sourceColumn.tasks];
    const destTasks = [...destColumn.tasks];
    const [removed] = sourceTasks.splice(source.index, 1);
    const updatedTask = {
      ...removed,
      status: destination.droppableId as TaskStatus,
    };
    destTasks.splice(destination.index, 0, updatedTask);

    setColumns(
      columns.map((col) => {
        if (col.id === source.droppableId) {
          return { ...col, tasks: sourceTasks };
        }
        if (col.id === destination.droppableId) {
          return { ...col, tasks: destTasks };
        }
        return col;
      })
    );
  };

  const handleAddTask = () => {
    // Convert hours to minutes (1 hour = 60 minutes)
    const estimatedMinutes = parseFloat(newTask.estimatedTime) * 60;

    const task: Task = {
      id: uuidv4(),
      title: newTask.title,
      description: newTask.description,
      status: "TODO",
      priority: newTask.priority,
      assignee: newTask.assignee,
      dueDate: new Date(newTask.dueDate),
      createdAt: new Date(),
      workLogs: [],
      estimatedTime: estimatedMinutes,
      actualTime: 0,
      tags: newTask.tags.split(",").map((tag) => tag.trim()),
      attachments: [],
    };

    // Add new assignee to the list if it's not already there
    if (newTask.assignee && !assignees.includes(newTask.assignee)) {
      setAssignees([...assignees, newTask.assignee]);
    }

    setColumns(
      columns.map((col) => {
        if (col.id === "TODO") {
          return { ...col, tasks: [...col.tasks, task] };
        }
        return col;
      })
    );

    setNewTask({
      title: "",
      description: "",
      priority: "MEDIUM",
      assignee: "",
      dueDate: "",
      estimatedTime: "",
      tags: "",
    });
    setOpen(false);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setColumns(
      columns.map((col) => ({
        ...col,
        tasks: col.tasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        ),
      }))
    );
  };

  const handleUpdateColumns = (updatedColumns: ColumnType[]) => {
    setColumns(updatedColumns);
  };

  const filteredColumns = columns.map((column) => ({
    ...column,
    tasks: selectedAssignee
      ? column.tasks.filter((task) => task.assignee === selectedAssignee)
      : column.tasks,
  }));

  const renderBoardContent = () => (
    <Fade in={!loading} timeout={500}>
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              letterSpacing: "-1px",
            }}
          >
            Project Management Board
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel sx={{ fontFamily: "'Roboto', sans-serif" }}>
                Filter by Assignee
              </InputLabel>
              <Select
                value={selectedAssignee}
                label="Filter by Assignee"
                onChange={(e) => setSelectedAssignee(e.target.value)}
                sx={{
                  height: 40,
                  fontFamily: "'Roboto', sans-serif",
                }}
              >
                <MenuItem value="">All</MenuItem>
                {assignees.map((assignee) => (
                  <MenuItem key={assignee} value={assignee}>
                    {assignee}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <IconButton onClick={() => setUserManagementOpen(true)}>
              <GroupIcon />
            </IconButton>
            <IconButton onClick={() => setConfigOpen(true)}>
              <SettingsIcon />
            </IconButton>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpen(true)}
              sx={{
                fontFamily: "'Roboto', sans-serif",
                fontWeight: 500,
                textTransform: "none",
              }}
            >
              Add Task
            </Button>
          </Box>
        </Box>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 2 }}>
            {filteredColumns.map((column) => (
              <Column
                key={column.id}
                column={column}
                onTaskClick={setSelectedTask}
              />
            ))}
          </Box>
        </DragDropContext>
      </Box>
    </Fade>
  );

  const renderLoadingState = () => (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Skeleton variant="text" width={200} height={40} />
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Skeleton variant="rectangular" width={200} height={40} />
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 2 }}>
        {[1, 2, 3, 4].map((index) => (
          <Box key={index} sx={{ minWidth: 300 }}>
            <Skeleton variant="text" width={150} height={30} sx={{ mb: 2 }} />
            {[1, 2, 3].map((taskIndex) => (
              <Skeleton
                key={taskIndex}
                variant="rectangular"
                height={100}
                sx={{ mb: 2 }}
              />
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      {loading ? renderLoadingState() : renderBoardContent()}

      <TaskDetails
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdateTask={handleUpdateTask}
      />

      <BoardConfig
        open={configOpen}
        onClose={() => setConfigOpen(false)}
        columns={columns}
        onUpdateColumns={handleUpdateColumns}
      />

      <UserManagement
        open={userManagementOpen}
        onClose={() => setUserManagementOpen(false)}
        assignees={assignees}
        onUpdateAssignees={setAssignees}
      />

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
        >
          Add New Task
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            sx={{
              "& .MuiInputLabel-root": { fontFamily: "'Roboto', sans-serif" },
              "& .MuiInputBase-root": { fontFamily: "'Roboto', sans-serif" },
            }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Priority"
            fullWidth
            select
            value={newTask.priority}
            onChange={(e) =>
              setNewTask({
                ...newTask,
                priority: e.target.value as TaskPriority,
              })
            }
          >
            <MenuItem value="LOW">Low</MenuItem>
            <MenuItem value="MEDIUM">Medium</MenuItem>
            <MenuItem value="HIGH">High</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            label="Assignee"
            fullWidth
            select
            value={newTask.assignee}
            onChange={(e) =>
              setNewTask({ ...newTask, assignee: e.target.value })
            }
          >
            {assignees.map((assignee) => (
              <MenuItem key={assignee} value={assignee}>
                {assignee}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Due Date"
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newTask.dueDate}
            onChange={(e) =>
              setNewTask({ ...newTask, dueDate: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Estimated Time (hours)"
            fullWidth
            type="number"
            value={newTask.estimatedTime}
            onChange={(e) =>
              setNewTask({ ...newTask, estimatedTime: e.target.value })
            }
            helperText="8 hours = 1 day"
          />
          <TextField
            margin="dense"
            label="Tags (comma-separated)"
            fullWidth
            value={newTask.tags}
            onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddTask} variant="contained" color="primary">
            Add Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Board;
