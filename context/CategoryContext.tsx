import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Category, CategoryFormData } from '../types';
import Colors from '../constants/Colors';

// Default categories
const DEFAULT_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Work',
    color: Colors.dark.categoryDefault,
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Personal',
    color: Colors.dark.accent,
    createdAt: new Date(),
  },
];

interface CategoryContextType {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  getCategoryById: (id: string) => Category | undefined;
  addCategory: (categoryData: CategoryFormData) => void;
  updateCategory: (id: string, categoryData: Partial<CategoryFormData>) => void;
  deleteCategory: (id: string) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize with default categories
  useEffect(() => {
    const initializeCategories = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setCategories(DEFAULT_CATEGORIES);
        setIsLoading(false);
      } catch (error) {
        setError('Failed to load categories');
        setIsLoading(false);
      }
    };

    initializeCategories();
  }, []);

  const getCategoryById = (id: string): Category | undefined => {
    return categories.find(category => category.id === id);
  };

  const addCategory = (categoryData: CategoryFormData) => {
    const newCategory: Category = {
      id: Date.now().toString(), // Generate a temporary ID
      ...categoryData,
      createdAt: new Date(),
    };

    setCategories(prevCategories => [...prevCategories, newCategory]);
  };

  const updateCategory = (id: string, categoryData: Partial<CategoryFormData>) => {
    setCategories(prevCategories =>
      prevCategories.map(category =>
        category.id === id
          ? { ...category, ...categoryData }
          : category
      )
    );
  };

  const deleteCategory = (id: string) => {
    // In a real app, you'd need to handle tasks in this category first
    setCategories(prevCategories => 
      prevCategories.filter(category => category.id !== id)
    );
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        isLoading,
        error,
        getCategoryById,
        addCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = (): CategoryContextType => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};