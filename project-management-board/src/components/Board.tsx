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
  Popover,
  Stack,
  InputAdornment,
  Paper,
  LinearProgress,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupIcon from "@mui/icons-material/Group";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { Column as ColumnType, Task, TaskStatus, TaskPriority } from "../types";
import Column from "./Column";
import TaskDetails from "./TaskDetails";
import BoardConfig from "./BoardConfig";
import UserManagement from "./UserManagement";
import EmptyState from "./EmptyState";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import BarChartIcon from "@mui/icons-material/BarChart";

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

const mockAssignees = [
  "John Smith",
  "Sarah Johnson",
  "Michael Chen",
  "Emily Davis",
  "David Wilson",
  "Lisa Anderson",
];

const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Design User Interface",
    description: "Create wireframes and mockups for the new dashboard layout",
    status: "TODO",
    priority: "HIGH",
    assignee: "John Smith",
    dueDate: new Date(2024, 3, 15),
    createdAt: new Date(2024, 3, 1),
    workLogs: [],
    estimatedTime: 480, // 8 hours
    actualTime: 0,
    tags: ["design", "ui", "wireframe"],
    attachments: [],
    dependencies: [],
    comments: [],
  },
  {
    id: "task-2",
    title: "Implement Authentication",
    description: "Set up user authentication and authorization system",
    status: "IN_PROGRESS",
    priority: "HIGH",
    assignee: "Sarah Johnson",
    dueDate: new Date(2024, 3, 20),
    createdAt: new Date(2024, 3, 1),
    workLogs: [],
    estimatedTime: 960, // 16 hours
    actualTime: 240, // 4 hours
    tags: ["auth", "security", "backend"],
    attachments: [],
    dependencies: [],
    comments: [],
  },
  {
    id: "task-3",
    title: "Database Optimization",
    description: "Optimize database queries and indexes for better performance",
    status: "BLOCKED",
    priority: "MEDIUM",
    assignee: "Michael Chen",
    dueDate: new Date(2024, 3, 25),
    createdAt: new Date(2024, 3, 1),
    workLogs: [],
    estimatedTime: 720, // 12 hours
    actualTime: 0,
    tags: ["database", "performance"],
    attachments: [],
    dependencies: ["task-2"],
    comments: [],
  },
  {
    id: "task-4",
    title: "Write Unit Tests",
    description: "Create comprehensive unit tests for core functionality",
    status: "DONE",
    priority: "MEDIUM",
    assignee: "Emily Davis",
    dueDate: new Date(2024, 3, 10),
    createdAt: new Date(2024, 2, 25),
    workLogs: [],
    estimatedTime: 600, // 10 hours
    actualTime: 720, // 12 hours
    tags: ["testing", "unit-tests"],
    attachments: [],
    dependencies: [],
    comments: [],
  },
  {
    id: "task-5",
    title: "API Documentation",
    description: "Document all API endpoints and create usage examples",
    status: "TODO",
    priority: "LOW",
    assignee: "David Wilson",
    dueDate: new Date(2024, 3, 30),
    createdAt: new Date(2024, 3, 1),
    workLogs: [],
    estimatedTime: 480, // 8 hours
    actualTime: 0,
    tags: ["documentation", "api"],
    attachments: [],
    dependencies: ["task-2"],
    comments: [],
  },
  {
    id: "task-6",
    title: "Mobile Responsiveness",
    description: "Ensure the application is fully responsive on mobile devices",
    status: "IN_PROGRESS",
    priority: "HIGH",
    assignee: "Lisa Anderson",
    dueDate: new Date(2024, 3, 18),
    createdAt: new Date(2024, 3, 1),
    workLogs: [],
    estimatedTime: 720, // 12 hours
    actualTime: 360, // 6 hours
    tags: ["mobile", "responsive", "ui"],
    attachments: [],
    dependencies: ["task-1"],
    comments: [],
  },
];

const Board: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState<ColumnType[]>(defaultColumns);
  const [open, setOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [userManagementOpen, setUserManagementOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [assignees, setAssignees] = useState<string[]>(mockAssignees);
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
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | "">(
    ""
  );
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [filterAnchorEl, setFilterAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statsOpen, setStatsOpen] = useState(false);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      // Initialize columns with mock tasks
      const initializedColumns = columns.map((column) => ({
        ...column,
        tasks: mockTasks.filter((task) => task.status === column.id),
      }));
      setColumns(initializedColumns);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const validateTaskForm = () => {
    if (!newTask.title.trim()) {
      toast.error("Please enter a task title");
      return false;
    }
    if (!newTask.description.trim()) {
      toast.error("Please enter a task description");
      return false;
    }
    if (!newTask.assignee) {
      toast.error("Please select an assignee");
      return false;
    }
    if (!newTask.dueDate) {
      toast.error("Please select a due date");
      return false;
    }
    if (!newTask.estimatedTime || parseFloat(newTask.estimatedTime) <= 0) {
      toast.error("Please enter a valid estimated time");
      return false;
    }
    return true;
  };

  const handleAddTask = () => {
    if (!validateTaskForm()) return;

    // Convert hours to minutes (1 hour = 60 minutes)
    const estimatedMinutes = parseFloat(newTask.estimatedTime) * 60;

    const task: Task = {
      id: uuidv4(),
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      status: "TODO",
      priority: newTask.priority,
      assignee: newTask.assignee,
      dueDate: new Date(newTask.dueDate),
      createdAt: new Date(),
      workLogs: [],
      estimatedTime: estimatedMinutes,
      actualTime: 0,
      tags: newTask.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      attachments: [],
      dependencies: [],
      comments: [],
    };

    // Add new assignee to the list if it's not already there
    if (newTask.assignee && !assignees.includes(newTask.assignee)) {
      setAssignees([...assignees, newTask.assignee]);
      toast.success(`Added ${newTask.assignee} to team members`);
    }

    setColumns(
      columns.map((col) => {
        if (col.id === "TODO") {
          return { ...col, tasks: [...col.tasks, task] };
        }
        return col;
      })
    );

    toast.success("Task added successfully");
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

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    // Handle task movement
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

    // Check dependencies before allowing move
    if (destination.droppableId === "DONE") {
      const blockingTasks = sourceTasks.filter((task) =>
        task.dependencies.includes(removed.id)
      );
      if (blockingTasks.length > 0) {
        toast.error("Cannot move task to Done: has blocking dependencies");
        return;
      }
    }

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

    toast.success(`Task moved to ${destColumn.title}`);
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
    toast.success("Task updated successfully");
  };

  const handleUpdateColumns = (updatedColumns: ColumnType[]) => {
    setColumns(updatedColumns);
    toast.success("Board configuration updated");
  };

  const filteredColumns = columns.map((column) => ({
    ...column,
    tasks: column.tasks.filter((task) => {
      const matchesAssignee =
        !selectedAssignee || task.assignee === selectedAssignee;
      const matchesPriority =
        !selectedPriority || task.priority === selectedPriority;
      const matchesDateRange =
        (!startDate || task.dueDate >= startDate) &&
        (!endDate || task.dueDate <= endDate);
      const matchesSearch =
        !searchQuery ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      return (
        matchesAssignee && matchesPriority && matchesDateRange && matchesSearch
      );
    }),
  }));

  const getAllTasks = () => {
    return columns.reduce((acc, col) => [...acc, ...col.tasks], [] as Task[]);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const clearFilters = () => {
    setSelectedPriority("");
    setStartDate(null);
    setEndDate(null);
    setSelectedAssignee("");
    handleFilterClose();
  };

  const getTaskStats = () => {
    const allTasks = getAllTasks();
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(
      (task) => task.status === "DONE"
    ).length;
    const inProgressTasks = allTasks.filter(
      (task) => task.status === "IN_PROGRESS"
    ).length;
    const blockedTasks = allTasks.filter(
      (task) => task.status === "BLOCKED"
    ).length;
    const todoTasks = allTasks.filter((task) => task.status === "TODO").length;

    const priorityDistribution = {
      HIGH: allTasks.filter((task) => task.priority === "HIGH").length,
      MEDIUM: allTasks.filter((task) => task.priority === "MEDIUM").length,
      LOW: allTasks.filter((task) => task.priority === "LOW").length,
    };

    const completionRate =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      blockedTasks,
      todoTasks,
      priorityDistribution,
      completionRate,
    };
  };

  const renderStats = () => {
    const stats = getTaskStats();

    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          bgcolor: "background.default",
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <BarChartIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography
            variant="subtitle2"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              color: "text.primary",
              fontSize: "0.875rem",
            }}
          >
            Task Statistics
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid xs={12}>
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
                Overall Progress
              </Typography>
              <LinearProgress
                variant="determinate"
                value={stats.completionRate}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "rgba(33, 150, 243, 0.1)",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#2196f3",
                  },
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  color: "text.secondary",
                  display: "block",
                  mt: 1,
                }}
              >
                {stats.completedTasks} of {stats.totalTasks} tasks completed
              </Typography>
            </Box>
          </Grid>
          <Grid xs={12} sm={6}>
            <Typography
              variant="caption"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                color: "text.secondary",
                display: "block",
                mb: 1,
              }}
            >
              Task Distribution
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    color: "text.secondary",
                    display: "block",
                    mb: 0.5,
                  }}
                >
                  To Do ({stats.todoTasks})
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(stats.todoTasks / stats.totalTasks) * 100}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: "rgba(33, 150, 243, 0.1)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#2196f3",
                    },
                  }}
                />
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    color: "text.secondary",
                    display: "block",
                    mb: 0.5,
                  }}
                >
                  In Progress ({stats.inProgressTasks})
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(stats.inProgressTasks / stats.totalTasks) * 100}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: "rgba(255, 167, 38, 0.1)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#ff9800",
                    },
                  }}
                />
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    color: "text.secondary",
                    display: "block",
                    mb: 0.5,
                  }}
                >
                  Blocked ({stats.blockedTasks})
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(stats.blockedTasks / stats.totalTasks) * 100}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: "rgba(244, 67, 54, 0.1)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#f44336",
                    },
                  }}
                />
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    color: "text.secondary",
                    display: "block",
                    mb: 0.5,
                  }}
                >
                  Done ({stats.completedTasks})
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(stats.completedTasks / stats.totalTasks) * 100}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: "rgba(76, 175, 80, 0.1)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#4caf50",
                    },
                  }}
                />
              </Box>
            </Box>
          </Grid>
          <Grid xs={12} sm={6}>
            <Typography
              variant="caption"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                color: "text.secondary",
                display: "block",
                mb: 1,
              }}
            >
              Priority Distribution
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    color: "text.secondary",
                    display: "block",
                    mb: 0.5,
                  }}
                >
                  High ({stats.priorityDistribution.HIGH})
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={
                    (stats.priorityDistribution.HIGH / stats.totalTasks) * 100
                  }
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: "rgba(244, 67, 54, 0.1)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#f44336",
                    },
                  }}
                />
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    color: "text.secondary",
                    display: "block",
                    mb: 0.5,
                  }}
                >
                  Medium ({stats.priorityDistribution.MEDIUM})
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={
                    (stats.priorityDistribution.MEDIUM / stats.totalTasks) * 100
                  }
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: "rgba(255, 167, 38, 0.1)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#ff9800",
                    },
                  }}
                />
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    color: "text.secondary",
                    display: "block",
                    mb: 0.5,
                  }}
                >
                  Low ({stats.priorityDistribution.LOW})
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={
                    (stats.priorityDistribution.LOW / stats.totalTasks) * 100
                  }
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: "rgba(76, 175, 80, 0.1)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#4caf50",
                    },
                  }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  const renderBoardContent = () => {
    const hasTasks = columns.some((column) => column.tasks.length > 0);
    const hasUsers = assignees.length > 0;

    return (
      <Fade in={!loading} timeout={500}>
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <DashboardIcon
                sx={{
                  fontSize: 32,
                  color: "primary.main",
                  opacity: 0.9,
                }}
              />
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    letterSpacing: "-0.5px",
                    background:
                      "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  TaskFlow
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    color: "text.secondary",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                  }}
                >
                  Streamline Your Work
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <TextField
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    width: 300,
                    "& .MuiInputLabel-root": {
                      fontFamily: "'Poppins', sans-serif",
                    },
                    "& .MuiInputBase-root": {
                      fontFamily: "'Poppins', sans-serif",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
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
              </Box>
              <IconButton onClick={handleFilterClick}>
                <FilterListIcon />
              </IconButton>
              <Popover
                open={Boolean(filterAnchorEl)}
                anchorEl={filterAnchorEl}
                onClose={handleFilterClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    p: 2,
                    minWidth: 300,
                    borderRadius: 2,
                    boxShadow: 3,
                  },
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      color: "text.primary",
                      fontSize: "0.875rem",
                      mb: 1,
                    }}
                  >
                    Advanced Filters
                  </Typography>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={selectedPriority}
                      label="Priority"
                      onChange={(e) =>
                        setSelectedPriority(e.target.value as TaskPriority | "")
                      }
                      sx={{
                        height: 40,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="HIGH">High</MenuItem>
                      <MenuItem value="MEDIUM">Medium</MenuItem>
                      <MenuItem value="LOW">Low</MenuItem>
                    </Select>
                  </FormControl>
                  <Stack spacing={2}>
                    <TextField
                      label="Start Date"
                      type="date"
                      value={
                        startDate ? startDate.toISOString().split("T")[0] : ""
                      }
                      onChange={(e) =>
                        setStartDate(
                          e.target.value ? new Date(e.target.value) : null
                        )
                      }
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      sx={{
                        "& .MuiInputLabel-root": {
                          fontFamily: "'Poppins', sans-serif",
                        },
                        "& .MuiInputBase-root": {
                          fontFamily: "'Poppins', sans-serif",
                        },
                      }}
                    />
                    <TextField
                      label="End Date"
                      type="date"
                      value={endDate ? endDate.toISOString().split("T")[0] : ""}
                      onChange={(e) =>
                        setEndDate(
                          e.target.value ? new Date(e.target.value) : null
                        )
                      }
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      sx={{
                        "& .MuiInputLabel-root": {
                          fontFamily: "'Poppins', sans-serif",
                        },
                        "& .MuiInputBase-root": {
                          fontFamily: "'Poppins', sans-serif",
                        },
                      }}
                    />
                  </Stack>
                </Box>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
                >
                  <Button
                    onClick={clearFilters}
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 500,
                      textTransform: "none",
                      fontSize: "0.875rem",
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    onClick={handleFilterClose}
                    variant="contained"
                    color="primary"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 500,
                      textTransform: "none",
                      fontSize: "0.875rem",
                    }}
                  >
                    Apply
                  </Button>
                </Box>
              </Popover>
              <IconButton onClick={() => setStatsOpen(true)}>
                <BarChartIcon />
              </IconButton>
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

          {!hasUsers ? (
            <EmptyState
              type="users"
              onAction={() => setUserManagementOpen(true)}
            />
          ) : !hasTasks ? (
            <EmptyState type="tasks" onAction={() => setOpen(true)} />
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  overflowX: "auto",
                  pb: 2,
                  minHeight: "calc(100vh - 200px)",
                }}
              >
                {filteredColumns.map((column) => (
                  <Column
                    key={column.id}
                    column={column}
                    onTaskClick={setSelectedTask}
                  />
                ))}
              </Box>
            </DragDropContext>
          )}
        </Box>
      </Fade>
    );
  };

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
        allTasks={getAllTasks()}
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
        open={statsOpen}
        onClose={() => setStatsOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 3,
            maxHeight: "90vh",
            overflow: "auto",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            letterSpacing: "-0.5px",
            fontSize: "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <BarChartIcon sx={{ color: "primary.main" }} />
          Task Statistics
        </DialogTitle>
        <DialogContent>{renderStats()}</DialogContent>
        <DialogActions>
          <Button
            onClick={() => setStatsOpen(false)}
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

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
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
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            letterSpacing: "-0.5px",
            fontSize: "1.25rem",
          }}
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
            error={!newTask.title.trim()}
            helperText={!newTask.title.trim() ? "Title is required" : ""}
            sx={{
              mb: 2,
              "& .MuiInputLabel-root": { fontFamily: "'Poppins', sans-serif" },
              "& .MuiInputBase-root": { fontFamily: "'Poppins', sans-serif" },
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
            error={!newTask.description.trim()}
            helperText={
              !newTask.description.trim() ? "Description is required" : ""
            }
            sx={{
              mb: 2,
              "& .MuiInputLabel-root": { fontFamily: "'Poppins', sans-serif" },
              "& .MuiInputBase-root": { fontFamily: "'Poppins', sans-serif" },
            }}
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
            sx={{
              mb: 2,
              "& .MuiInputLabel-root": { fontFamily: "'Poppins', sans-serif" },
              "& .MuiInputBase-root": { fontFamily: "'Poppins', sans-serif" },
            }}
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
            error={!newTask.assignee}
            helperText={!newTask.assignee ? "Assignee is required" : ""}
            sx={{
              mb: 2,
              "& .MuiInputLabel-root": { fontFamily: "'Poppins', sans-serif" },
              "& .MuiInputBase-root": { fontFamily: "'Poppins', sans-serif" },
            }}
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
            error={!newTask.dueDate}
            helperText={!newTask.dueDate ? "Due date is required" : ""}
            sx={{
              mb: 2,
              "& .MuiInputLabel-root": { fontFamily: "'Poppins', sans-serif" },
              "& .MuiInputBase-root": { fontFamily: "'Poppins', sans-serif" },
            }}
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
            error={
              !newTask.estimatedTime || parseFloat(newTask.estimatedTime) <= 0
            }
            helperText={
              !newTask.estimatedTime || parseFloat(newTask.estimatedTime) <= 0
                ? "Please enter a valid time"
                : "8 hours = 1 day"
            }
            sx={{
              mb: 2,
              "& .MuiInputLabel-root": { fontFamily: "'Poppins', sans-serif" },
              "& .MuiInputBase-root": { fontFamily: "'Poppins', sans-serif" },
            }}
          />
          <TextField
            margin="dense"
            label="Tags (comma-separated)"
            fullWidth
            value={newTask.tags}
            onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })}
            sx={{
              mb: 2,
              "& .MuiInputLabel-root": { fontFamily: "'Poppins', sans-serif" },
              "& .MuiInputBase-root": { fontFamily: "'Poppins', sans-serif" },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
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
            onClick={handleAddTask}
            variant="contained"
            color="primary"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 500,
              textTransform: "none",
              fontSize: "0.875rem",
            }}
          >
            Add Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Board;
