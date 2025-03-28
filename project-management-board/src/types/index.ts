export type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "BLOCKED"
  | "READY_FOR_QA"
  | "IN_QA"
  | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface WorkLog {
  id: string;
  taskId: string;
  userId: string;
  timestamp: Date;
  description: string;
  timeSpent: number; // in minutes
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
  assignee: string;
  createdAt: Date;
  workLogs: WorkLog[];
  estimatedTime: number; // in minutes
  actualTime: number; // in minutes
  tags: string[];
  attachments: string[];
}

export interface Column {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}
