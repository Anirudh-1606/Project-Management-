import React, { useState } from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import { Box, Button, Typography } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";

interface AppWalkthroughProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps: Step[] = [
  {
    target: ".board-title",
    content:
      "Welcome to TaskFlow! This is your project management board where you can organize and track your tasks.",
    disableBeacon: true,
  },
  {
    target: ".search-field",
    content:
      "Search for tasks by title or description to quickly find what you're looking for.",
  },
  {
    target: ".assignee-filter",
    content: "Filter tasks by team member to focus on specific assignments.",
  },
  {
    target: ".filter-button",
    content:
      "Use advanced filters to sort tasks by priority, date range, and more.",
  },
  {
    target: ".stats-button",
    content:
      "View task statistics and progress metrics to track your team's performance.",
  },
  {
    target: ".user-management",
    content: "Manage team members and their assignments in one place.",
  },
  {
    target: ".board-config",
    content:
      "Customize your board layout and workflow stages to match your team's needs.",
  },
  {
    target: ".add-task-button",
    content:
      "Create new tasks and assign them to team members with just a few clicks.",
  },
  {
    target: ".task-card",
    content:
      "Drag and drop tasks between columns to update their status. Click the eye icon to view or edit task details.",
  },
];

const AppWalkthrough: React.FC<AppWalkthroughProps> = ({ isOpen, onClose }) => {
  const [run, setRun] = useState(isOpen);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      onClose();
    }
  };

  return (
    <>
      <Joyride
        callback={handleJoyrideCallback}
        continuous
        hideCloseButton
        hideBackButton
        run={run}
        scrollToFirstStep
        showProgress
        showSkipButton
        steps={steps}
        styles={{
          options: {
            arrowColor: "#1a1a1a",
            backgroundColor: "#1a1a1a",
            overlayColor: "rgba(0, 0, 0, 0.7)",
            primaryColor: "#2196f3",
            textColor: "#ffffff",
            zIndex: 1000,
          },
        }}
      />
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<HelpIcon />}
          onClick={() => setRun(true)}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 500,
            boxShadow: 3,
            backgroundColor: "#1a1a1a",
            "&:hover": {
              backgroundColor: "#2d2d2d",
            },
          }}
        >
          Start Tour
        </Button>
      </Box>
    </>
  );
};

export default AppWalkthrough;
