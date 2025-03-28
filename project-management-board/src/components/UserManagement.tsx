import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Paper,
  Avatar,
  Fade,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupIcon from "@mui/icons-material/Group";

interface UserManagementProps {
  open: boolean;
  onClose: () => void;
  assignees: string[];
  onUpdateAssignees: (assignees: string[]) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({
  open,
  onClose,
  assignees,
  onUpdateAssignees,
}) => {
  const [newAssignee, setNewAssignee] = useState("");

  const handleAddAssignee = () => {
    if (newAssignee && !assignees.includes(newAssignee)) {
      onUpdateAssignees([...assignees, newAssignee]);
      setNewAssignee("");
    }
  };

  const handleRemoveAssignee = (assignee: string) => {
    onUpdateAssignees(assignees.filter((a) => a !== assignee));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <GroupIcon sx={{ color: "primary.main" }} />
        Team Members
      </DialogTitle>
      <DialogContent>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            bgcolor: "background.default",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
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
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <PersonAddIcon fontSize="small" color="primary" />
            Add New Team Member
          </Typography>
          <TextField
            fullWidth
            label="Name"
            value={newAssignee}
            onChange={(e) => setNewAssignee(e.target.value)}
            sx={{
              mb: 1,
              "& .MuiInputLabel-root": { fontFamily: "'Poppins', sans-serif" },
              "& .MuiInputBase-root": { fontFamily: "'Poppins', sans-serif" },
            }}
          />
          <Button
            variant="contained"
            onClick={handleAddAssignee}
            disabled={!newAssignee || assignees.includes(newAssignee)}
            startIcon={<PersonAddIcon />}
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
            Add Team Member
          </Button>
        </Paper>

        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            color: "text.primary",
            fontSize: "1rem",
            mb: 2,
          }}
        >
          Current Team Members
        </Typography>
        <List sx={{ p: 0 }}>
          {assignees.map((assignee, index) => (
            <Fade in timeout={300} key={assignee}>
              <ListItem
                sx={{
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  mb: 1,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "action.hover",
                    transform: "translateX(4px)",
                  },
                }}
                secondaryAction={
                  <Tooltip title="Remove member">
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleRemoveAssignee(assignee)}
                      sx={{
                        color: "error.main",
                        "&:hover": {
                          bgcolor: "error.lighter",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                }
              >
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    mr: 2,
                    width: 40,
                    height: 40,
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  {getInitials(assignee)}
                </Avatar>
                <ListItemText
                  primary={assignee}
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                    },
                  }}
                />
              </ListItem>
            </Fade>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
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
  );
};

export default UserManagement;
