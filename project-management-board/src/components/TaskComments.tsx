import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  IconButton,
  Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { format } from "date-fns";
import { Task, Comment } from "../types";

interface TaskCommentsProps {
  task: Task;
  currentUser: string;
  onAddComment: (content: string, attachments: string[]) => void;
}

const TaskComments: React.FC<TaskCommentsProps> = ({
  task,
  currentUser,
  onAddComment,
}) => {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim(), []);
      setNewComment("");
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        bgcolor: "background.default",
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            color: "text.primary",
            fontSize: "0.875rem",
          }}
        >
          Comments
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        {task.comments.map((comment) => (
          <Box key={comment.id} sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  mr: 1,
                  bgcolor: "primary.main",
                }}
              >
                {comment.author[0].toUpperCase()}
              </Avatar>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 500,
                  }}
                >
                  {comment.author}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    color: "text.secondary",
                  }}
                >
                  {format(new Date(comment.createdAt), "MMM dd, yyyy HH:mm")}
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                ml: 4,
              }}
            >
              {comment.content}
            </Typography>
            {comment.attachments.length > 0 && (
              <Box sx={{ ml: 4, mt: 1 }}>
                {comment.attachments.map((attachment, index) => (
                  <IconButton key={index} size="small" sx={{ mr: 1 }}>
                    <AttachFileIcon fontSize="small" />
                  </IconButton>
                ))}
              </Box>
            )}
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </Box>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            size="small"
            sx={{
              "& .MuiInputBase-root": {
                fontFamily: "'Poppins', sans-serif",
              },
            }}
          />
          <IconButton size="small" color="primary">
            <AttachFileIcon />
          </IconButton>
          <Button
            type="submit"
            variant="contained"
            disabled={!newComment.trim()}
            sx={{
              minWidth: "auto",
              px: 2,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            <SendIcon />
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default TaskComments;
