import { FormErrors, TaskFormData, CategoryFormData } from '../types';

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates that a string has a minimum length
 */
export const hasMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

/**
 * Validates that a string isn't empty
 */
export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Validates login form
 */
export const validateLoginForm = (email: string, password: string): FormErrors => {
  const errors: FormErrors = {};
  
  if (!isNotEmpty(email)) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email';
  }
  
  if (!isNotEmpty(password)) {
    errors.password = 'Password is required';
  } else if (!hasMinLength(password, 6)) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  return errors;
};

/**
 * Validates signup form
 */
export const validateSignupForm = (
  displayName: string,
  email: string, 
  password: string, 
  confirmPassword: string
): FormErrors => {
  const errors: FormErrors = {};
  
  if (!isNotEmpty(displayName)) {
    errors.displayName = 'Name is required';
  }
  
  if (!isNotEmpty(email)) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email';
  }
  
  if (!isNotEmpty(password)) {
    errors.password = 'Password is required';
  } else if (!hasMinLength(password, 6)) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return errors;
};

/**
 * Validates task form
 */
export const validateTaskForm = (task: Partial<TaskFormData>): FormErrors => {
  const errors: FormErrors = {};
  
  if (!isNotEmpty(task.title || '')) {
    errors.title = 'Title is required';
  }
  
  if (!task.categoryId) {
    errors.categoryId = 'Please select a category';
  }
  
  return errors;
};

/**
 * Validates category form
 */
export const validateCategoryForm = (category: Partial<CategoryFormData>): FormErrors => {
  const errors: FormErrors = {};
  
  if (!isNotEmpty(category.name || '')) {
    errors.name = 'Category name is required';
  }
  
  if (!isNotEmpty(category.color || '')) {
    errors.color = 'Please select a color';
  }
  
  return errors;
};