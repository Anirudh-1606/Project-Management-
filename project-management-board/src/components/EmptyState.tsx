import React from "react";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import GroupIcon from "@mui/icons-material/Group";
import TaskIcon from "@mui/icons-material/Task";

interface EmptyStateProps {
  type: "tasks" | "users";
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ type, onAction }) => {
  const getContent = () => {
    switch (type) {
      case "tasks":
        return {
          title: "No Tasks Yet",
          message: "Get started by creating your first task",
          icon: (
            <TaskIcon sx={{ fontSize: 80, color: "primary.main", mb: 2 }} />
          ),
          buttonText: "Add Task",
        };
      case "users":
        return {
          title: "No Team Members",
          message: "Add team members to assign tasks",
          icon: (
            <GroupIcon sx={{ fontSize: 80, color: "primary.main", mb: 2 }} />
          ),
          buttonText: "Add Team Member",
        };
      default:
        return {
          title: "",
          message: "",
          icon: null,
          buttonText: "",
        };
    }
  };

  const content = getContent();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        px: 2,
        textAlign: "center",
        backgroundColor: "background.paper",
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      {content.icon}
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 600,
          color: "text.primary",
        }}
      >
        {content.title}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          fontFamily: "'Roboto', sans-serif",
          mb: 3,
          maxWidth: 400,
        }}
      >
        {content.message}
      </Typography>
      {onAction && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAction}
          sx={{
            fontFamily: "'Roboto', sans-serif",
            fontWeight: 500,
            textTransform: "none",
          }}
        >
          {content.buttonText}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
