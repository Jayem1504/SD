// User related types
export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar: string | null;
}

// Authentication related types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Task related types
export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date | null;
  priority: TaskPriority;
  completed: boolean;
  notes: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskFormData {
  title: string;
  description: string;
  dueDate: Date | null;
  priority: TaskPriority;
  notes: string;
  categoryId: string;
}

// Category related types
export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
}

export interface CategoryFormData {
  name: string;
  color: string;
}

// Form validation
export interface FormErrors {
  [key: string]: string;
}

// Navigation
export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  TaskDetails: { taskId: string };
  NewTask: undefined;
  EditTask: { taskId: string };
  NewCategory: undefined;
};