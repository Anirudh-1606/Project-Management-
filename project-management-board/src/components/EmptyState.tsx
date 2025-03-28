import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
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
            <TaskIcon
              sx={{
                fontSize: 80,
                color: "primary.main",
                mb: 2,
                opacity: 0.8,
                animation: "float 3s ease-in-out infinite",
                "@keyframes float": {
                  "0%": { transform: "translateY(0px)" },
                  "50%": { transform: "translateY(-10px)" },
                  "100%": { transform: "translateY(0px)" },
                },
              }}
            />
          ),
          buttonText: "Add Task",
        };
      case "users":
        return {
          title: "No Team Members",
          message: "Add team members to assign tasks",
          icon: (
            <GroupIcon
              sx={{
                fontSize: 80,
                color: "primary.main",
                mb: 2,
                opacity: 0.8,
                animation: "float 3s ease-in-out infinite",
                "@keyframes float": {
                  "0%": { transform: "translateY(0px)" },
                  "50%": { transform: "translateY(-10px)" },
                  "100%": { transform: "translateY(0px)" },
                },
              }}
            />
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
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        px: 4,
        textAlign: "center",
        backgroundColor: "background.paper",
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
        border: "1px solid",
        borderColor: "divider",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
          transform: "translateY(-2px)",
        },
      }}
    >
      {content.icon}
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 600,
          color: "text.primary",
          letterSpacing: "-0.5px",
          mb: 1,
        }}
      >
        {content.title}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          fontFamily: "'Poppins', sans-serif",
          mb: 3,
          maxWidth: 400,
          fontSize: "1rem",
          lineHeight: 1.6,
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
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 500,
            textTransform: "none",
            px: 3,
            py: 1,
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          {content.buttonText}
        </Button>
      )}
    </Paper>
  );
};

export default EmptyState;
