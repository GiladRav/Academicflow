
export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent'
}

export enum TaskCategory {
  EXAM = 'Exam',
  PAPER = 'Paper',
  HOMEWORK = 'Homework',
  LAB = 'Lab',
  PROJECT = 'Project',
  OTHER = 'Other'
}

export interface SubTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  category: TaskCategory;
  dueDate: string;
  isCompleted: boolean;
  subTasks: SubTask[];
  collaborators: string[];
  createdAt: string;
}

export interface AIResponse {
  suggestions: string[];
  breakdown: string[];
  estimatedHours: number;
}
