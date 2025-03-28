export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type TaskStatus = string; // Allow any string for custom stages

export interface WorkLog {
  id: string;
  taskId: string;
  userId: string;
  timestamp: Date;
  timeSpent: number;
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
  estimatedTime: number;
  actualTime: number;
  tags: string[];
  attachments: string[];
}

export interface Column {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}
