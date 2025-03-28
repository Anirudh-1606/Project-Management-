export type TaskStatus = "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
  attachments: string[];
}

export interface WorkLog {
  id: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  timeSpent: number; // in minutes
  description: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  dueDate: Date;
  createdAt: Date;
  workLogs: WorkLog[];
  estimatedTime: number; // in minutes
  actualTime: number; // in minutes
  tags: string[];
  attachments: string[];
  dependencies: string[]; // Array of task IDs this task depends on
  comments: Comment[];
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}
