import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Tag } from 'lucide-react-native';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useTasks } from '../../context/TaskContext';
import { useCategories } from '../../context/CategoryContext';
import { TaskFormData, Task, TaskPriority, FormErrors } from '../../types';
import { validateTaskForm } from '../../utils/validationUtils';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

interface TaskFormProps {
  taskId?: string;
  onSuccess?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ taskId, onSuccess }) => {
  const { addTask, updateTask, getTaskById } = useTasks();
  const { categories } = useCategories();
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  const isEditMode = !!taskId;
  const existingTask = taskId ? getTaskById(taskId) : undefined;

  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    dueDate: null,
    priority: TaskPriority.MEDIUM,
    notes: '',
    categoryId: categories.length > 0 ? categories[0].id : '',
  });

  useEffect(() => {
    if (isEditMode && existingTask) {
      setFormData({
        title: existingTask.title,
        description: existingTask.description,
        dueDate: existingTask.dueDate,
        priority: existingTask.priority,
        notes: existingTask.notes,
        categoryId: existingTask.categoryId,
      });
    }
  }, [isEditMode, existingTask]);

  const handleChange = (key: keyof TaskFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
    
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validateTaskForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isEditMode && taskId) {
        updateTask(taskId, formData);
      } else {
        addTask(formData);
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.back();
      }
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return Colors.dark.priorityHigh;
      case TaskPriority.MEDIUM:
        return Colors.dark.priorityMedium;
      case TaskPriority.LOW:
        return Colors.dark.priorityLow;
      default:
        return Colors.dark.priorityLow;
    }
  };

  const selectedCategory = categories.find(c => c.id === formData.categoryId);

  return (
    <View style={styles.container}>
      <Input
        label="Task Title"
        placeholder="What do you need to do?"
        value={formData.title}
        onChangeText={(value) => handleChange('title', value)}
        error={errors.title}
      />

      <Input
        label="Description"
        placeholder="Add some details about this task..."
        value={formData.description}
        onChangeText={(value) => handleChange('description', value)}
        multiline
      />

      <View style={styles.optionsContainer}>
        <Text style={styles.sectionTitle}>Task Options</Text>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => setShowPriorityDropdown(!showPriorityDropdown)}
        >
          <View 
            style={[
              styles.optionIconContainer,
              { backgroundColor: getPriorityColor(formData.priority) + '20' }
            ]}
          >
            <View 
              style={[
                styles.priorityIndicator,
                { backgroundColor: getPriorityColor(formData.priority) }
              ]}
            />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionLabel}>Priority</Text>
            <Text style={styles.optionValue}>{formData.priority}</Text>
          </View>
        </TouchableOpacity>

        {showPriorityDropdown && (
          <View style={styles.dropdown}>
            {Object.values(TaskPriority).map((priority) => (
              <TouchableOpacity
                key={priority}
                style={styles.dropdownItem}
                onPress={() => {
                  handleChange('priority', priority);
                  setShowPriorityDropdown(false);
                }}
              >
                <View 
                  style={[
                    styles.priorityDot,
                    { backgroundColor: getPriorityColor(priority) }
                  ]}
                />
                <Text style={styles.dropdownText}>{priority}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        <TouchableOpacity
          style={[styles.optionButton, styles.fullWidthOption]}
          onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
        >
          <View 
            style={[
              styles.optionIconContainer,
              { backgroundColor: selectedCategory?.color + '20' || Colors.dark.backgroundSecondary }
            ]}
          >
            <Tag size={20} color={selectedCategory?.color || Colors.dark.text} />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionLabel}>Category</Text>
            <Text style={styles.optionValue}>
              {selectedCategory?.name || 'Uncategorized'}
            </Text>
          </View>
        </TouchableOpacity>

        {showCategoryDropdown && (
          <View style={styles.dropdown}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.dropdownItem}
                onPress={() => {
                  handleChange('categoryId', category.id);
                  setShowCategoryDropdown(false);
                }}
              >
                <View 
                  style={[
                    styles.categoryDot,
                    { backgroundColor: category.color }
                  ]}
                />
                <Text style={styles.dropdownText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.buttons}>
        <Button
          title={isEditMode ? 'Update Task' : 'Add Task'}
          onPress={handleSubmit}
          loading={isSubmitting}
          fullWidth
        />
        
        <Button
          title="Cancel"
          onPress={() => router.back()}
          variant="outline"
          style={styles.cancelButton}
          fullWidth
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Layout.spacing.m,
  },
  optionsContainer: {
    marginBottom: Layout.spacing.l,
  },
  sectionTitle: {
    fontSize: Layout.typography.fontSizes.m,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: Layout.spacing.s,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: Layout.borderRadius.m,
    padding: Layout.spacing.m,
    marginBottom: Layout.spacing.s,
  },
  fullWidthOption: {
    marginRight: 0,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: Layout.borderRadius.m,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.m,
  },
  priorityIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: Layout.typography.fontSizes.s,
    color: Colors.dark.textSecondary,
    marginBottom: Layout.spacing.xs / 2,
  },
  optionValue: {
    fontSize: Layout.typography.fontSizes.m,
    fontWeight: '500',
    color: Colors.dark.text,
  },
  dropdown: {
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: Layout.borderRadius.m,
    marginTop: -Layout.spacing.s,
    marginBottom: Layout.spacing.m,
    padding: Layout.spacing.s,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.m,
    borderRadius: Layout.borderRadius.s,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Layout.spacing.m,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Layout.spacing.m,
  },
  dropdownText: {
    fontSize: Layout.typography.fontSizes.m,
    color: Colors.dark.text,
  },
  buttons: {
    marginTop: Layout.spacing.xl,
  },
  cancelButton: {
    marginTop: Layout.spacing.m,
  },
});

export default TaskForm;