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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
        Team Members
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="New Team Member"
            value={newAssignee}
            onChange={(e) => setNewAssignee(e.target.value)}
            sx={{ mb: 1 }}
          />
          <Button
            variant="contained"
            onClick={handleAddAssignee}
            disabled={!newAssignee || assignees.includes(newAssignee)}
            sx={{
              fontFamily: "'Roboto', sans-serif",
              fontWeight: 500,
              textTransform: "none",
            }}
          >
            Add Team Member
          </Button>
        </Box>

        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
        >
          Current Team Members
        </Typography>
        <List>
          {assignees.map((assignee) => (
            <ListItem
              key={assignee}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleRemoveAssignee(assignee)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={assignee}
                sx={{ fontFamily: "'Roboto', sans-serif" }}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserManagement;
