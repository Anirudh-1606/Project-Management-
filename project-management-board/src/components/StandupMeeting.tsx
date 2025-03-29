import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
  IconButton,
  Button,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  ScreenShare,
  StopScreenShare,
  Chat,
  MoreVert,
  Send,
  Timer,
  Group,
} from "@mui/icons-material";
import { Task } from "../types";

interface StandupMeetingProps {
  tasks: Task[];
  teamMembers: string[];
  onUpdateTask: (task: Task) => void;
}

interface TeamMemberStatus {
  name: string;
  isSpeaking: boolean;
  isVideoOn: boolean;
  isMicOn: boolean;
  isScreenSharing: boolean;
}

const StandupMeeting: React.FC<StandupMeetingProps> = ({
  tasks,
  teamMembers,
  onUpdateTask,
}) => {
  const [currentMember, setCurrentMember] = useState<string>("");
  const [memberStatus, setMemberStatus] = useState<TeamMemberStatus[]>(
    teamMembers.map((member) => ({
      name: member,
      isSpeaking: false,
      isVideoOn: true,
      isMicOn: true,
      isScreenSharing: false,
    }))
  );
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<
    Array<{
      sender: string;
      message: string;
      timestamp: Date;
    }>
  >([]);
  const [showChat, setShowChat] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(900); // 15 minutes in seconds
  const [isStandupActive, setIsStandupActive] = useState(false);
  const [standupSummary, setStandupSummary] = useState<{
    completed: string[];
    inProgress: string[];
    blocked: string[];
    nextSteps: string[];
  }>({
    completed: [],
    inProgress: [],
    blocked: [],
    nextSteps: [],
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isStandupActive && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isStandupActive, timeRemaining]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleStartStandup = () => {
    setIsStandupActive(true);
    setTimeRemaining(900);
  };

  const handleEndStandup = () => {
    setIsStandupActive(false);
    // Generate summary based on team updates
    const summary = {
      completed: tasks
        .filter((task) => task.status === "DONE")
        .map((t) => t.title),
      inProgress: tasks
        .filter((task) => task.status === "IN_PROGRESS")
        .map((t) => t.title),
      blocked: tasks
        .filter((task) => task.status === "BLOCKED")
        .map((t) => t.title),
      nextSteps: tasks
        .filter((task) => task.status === "TODO")
        .map((t) => t.title),
    };
    setStandupSummary(summary);
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      setChatMessages([
        ...chatMessages,
        {
          sender: "You",
          message: chatMessage,
          timestamp: new Date(),
        },
      ]);
      setChatMessage("");
    }
  };

  const handleUpdateStatus = (
    member: string,
    status: Partial<TeamMemberStatus>
  ) => {
    setMemberStatus(
      memberStatus.map((m) => (m.name === member ? { ...m, ...status } : m))
    );
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "background.default",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif" }}>
            Daily Standup
          </Typography>
          <Chip
            icon={<Timer />}
            label={formatTime(timeRemaining)}
            color={timeRemaining < 300 ? "error" : "primary"}
            size="small"
          />
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            onClick={() => setIsMicOn(!isMicOn)}
            color={isMicOn ? "primary" : "error"}
          >
            {isMicOn ? <Mic /> : <MicOff />}
          </IconButton>
          <IconButton
            onClick={() => setIsVideoOn(!isVideoOn)}
            color={isVideoOn ? "primary" : "error"}
          >
            {isVideoOn ? <Videocam /> : <VideocamOff />}
          </IconButton>
          <IconButton
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            color={isScreenSharing ? "primary" : "default"}
          >
            {isScreenSharing ? <ScreenShare /> : <StopScreenShare />}
          </IconButton>
          <IconButton onClick={() => setShowChat(!showChat)}>
            <Chat />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Video Grid */}
        <Box
          sx={{
            flex: 1,
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            overflow: "auto",
          }}
        >
          <Grid container spacing={2}>
            {memberStatus.map((member) => (
              <Grid item xs={12} sm={6} md={4} key={member.name}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    height: 200,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "background.default",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    position: "relative",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mb: 2,
                      bgcolor: "primary.main",
                    }}
                  >
                    {member.name.charAt(0)}
                  </Avatar>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {member.name}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    {!member.isMicOn && (
                      <Chip
                        icon={<MicOff />}
                        label="Muted"
                        size="small"
                        color="error"
                      />
                    )}
                    {!member.isVideoOn && (
                      <Chip
                        icon={<VideocamOff />}
                        label="Camera Off"
                        size="small"
                        color="error"
                      />
                    )}
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Chat Panel */}
        {showChat && (
          <Paper
            elevation={0}
            sx={{
              width: 300,
              display: "flex",
              flexDirection: "column",
              borderLeft: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Chat
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                overflow: "auto",
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {chatMessages.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {msg.sender}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {msg.message}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Type a message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <IconButton onClick={handleSendMessage} color="primary">
                  <Send />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        )}
      </Box>

      {/* Controls */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "center",
          gap: 2,
          bgcolor: "background.default",
        }}
      >
        {!isStandupActive ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleStartStandup}
            startIcon={<Group />}
          >
            Start Standup
          </Button>
        ) : (
          <Button variant="contained" color="error" onClick={handleEndStandup}>
            End Standup
          </Button>
        )}
      </Paper>

      {/* Standup Summary Dialog */}
      <Dialog
        open={!isStandupActive && standupSummary.completed.length > 0}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Standup Summary</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Completed Tasks
            </Typography>
            <List>
              {standupSummary.completed.map((task, index) => (
                <ListItem key={index}>
                  <ListItemText primary={task} />
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              In Progress
            </Typography>
            <List>
              {standupSummary.inProgress.map((task, index) => (
                <ListItem key={index}>
                  <ListItemText primary={task} />
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              Blocked Tasks
            </Typography>
            <List>
              {standupSummary.blocked.map((task, index) => (
                <ListItem key={index}>
                  <ListItemText primary={task} />
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              Next Steps
            </Typography>
            <List>
              {standupSummary.nextSteps.map((task, index) => (
                <ListItem key={index}>
                  <ListItemText primary={task} />
                </ListItem>
              ))}
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setStandupSummary({
                completed: [],
                inProgress: [],
                blocked: [],
                nextSteps: [],
              })
            }
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StandupMeeting;
