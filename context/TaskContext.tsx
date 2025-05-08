import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, TaskFormData, TaskPriority } from '../types';

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  getTaskById: (id: string) => Task | undefined;
  getTasksByCategory: (categoryId: string) => Task[];
  addTask: (taskData: TaskFormData) => void;
  updateTask: (id: string, taskData: Partial<TaskFormData>) => void;
  toggleTaskCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize with empty tasks array
  useEffect(() => {
    const initializeTasks = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // For the frontend-only version, we start with an empty tasks array
        setTasks([]);
        setIsLoading(false);
      } catch (error) {
        setError('Failed to load tasks');
        setIsLoading(false);
      }
    };

    initializeTasks();
  }, []);

  const getTaskById = (id: string): Task | undefined => {
    return tasks.find(task => task.id === id);
  };

  const getTasksByCategory = (categoryId: string): Task[] => {
    return tasks.filter(task => task.categoryId === categoryId);
  };

  const addTask = (taskData: TaskFormData) => {
    const newTask: Task = {
      id: Date.now().toString(), // Generate a temporary ID
      ...taskData,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTasks(prevTasks => [newTask, ...prevTasks]);
  };

  const updateTask = (id: string, taskData: Partial<TaskFormData>) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id
          ? { ...task, ...taskData, updatedAt: new Date() }
          : task
      )
    );
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed, updatedAt: new Date() }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        error,
        getTaskById,
        getTasksByCategory,
        addTask,
        updateTask,
        toggleTaskCompletion,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};