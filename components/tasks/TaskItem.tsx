import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { router } from 'expo-router';
import { Check, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Pencil, Trash2 } from 'lucide-react-native';
import Card from '../ui/Card';
import { useTasks } from '../../context/TaskContext';
import { useCategories } from '../../context/CategoryContext';
import { Task, TaskPriority } from '../../types';
import { getRelativeDateString } from '../../utils/dateUtils';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

interface TaskItemProps {
  task: Task;
  showCategory?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, showCategory = true }) => {
  const { toggleTaskCompletion, deleteTask } = useTasks();
  const { getCategoryById } = useCategories();
  const [deleteAnim] = useState(new Animated.Value(1));

  const category = getCategoryById(task.categoryId);

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

  const getPriorityLabel = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return 'High';
      case TaskPriority.MEDIUM:
        return 'Medium';
      case TaskPriority.LOW:
        return 'Low';
      default:
        return 'Low';
    }
  };

  const handleTaskPress = () => {
    router.navigate(`/(tabs)/tasks/${task.id}`);
  };

  const handleToggleCompletion = () => {
    toggleTaskCompletion(task.id);
  };

  const handleEditTask = () => {
    router.navigate(`/(tabs)/tasks/edit/${task.id}`);
  };

  const handleDeleteTask = () => {
    Animated.timing(deleteAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      deleteTask(task.id);
    });
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        { opacity: deleteAnim, transform: [{ scale: deleteAnim }] }
      ]}
    >
      <Card 
        pressable 
        onPress={handleTaskPress}
        style={[
          styles.card,
          task.completed && styles.completedCard
        ]}
      >
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={handleToggleCompletion}
          >
            {task.completed ? (
              <CheckCircle size={24} color={Colors.dark.success} />
            ) : (
              <View style={styles.checkbox}>
                <Check 
                  size={16} 
                  color="transparent" 
                  style={styles.checkIcon} 
                />
              </View>
            )}
          </TouchableOpacity>
          
          <View style={styles.contentContainer}>
            <View style={styles.titleRow}>
              <Text 
                style={[
                  styles.title,
                  task.completed && styles.completedText
                ]}
                numberOfLines={1}
              >
                {task.title}
              </Text>
              
              <View style={styles.priorityBadge}>
                <View
                  style={[
                    styles.priorityIndicator,
                    { backgroundColor: getPriorityColor(task.priority) }
                  ]}
                />
                <Text style={styles.priorityText}>
                  {getPriorityLabel(task.priority)}
                </Text>
              </View>
            </View>
            
            {task.description.length > 0 && (
              <Text 
                style={[
                  styles.description,
                  task.completed && styles.completedText
                ]}
                numberOfLines={2}
              >
                {task.description}
              </Text>
            )}
            
            <View style={styles.footer}>
              <View style={styles.metaInfo}>
                {task.dueDate && (
                  <View style={styles.dueDateContainer}>
                    <AlertCircle size={14} color={Colors.dark.textSecondary} />
                    <Text style={styles.dueDate}>
                      {getRelativeDateString(task.dueDate)}
                    </Text>
                  </View>
                )}
                
                {showCategory && category && (
                  <View 
                    style={[
                      styles.categoryBadge,
                      { backgroundColor: category.color + '20' } // Add transparency
                    ]}
                  >
                    <View 
                      style={[
                        styles.categoryDot,
                        { backgroundColor: category.color }
                      ]}
                    />
                    <Text style={styles.categoryText}>{category.name}</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleEditTask}
                >
                  <Pencil size={16} color={Colors.dark.textSecondary} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleDeleteTask}
                >
                  <Trash2 size={16} color={Colors.dark.error} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Layout.spacing.s,
  },
  card: {
    padding: Layout.spacing.m,
  },
  completedCard: {
    opacity: 0.7,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxContainer: {
    marginRight: Layout.spacing.m,
    marginTop: Layout.spacing.xs,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: Layout.borderRadius.s,
    borderWidth: 2,
    borderColor: Colors.dark.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    opacity: 0,
  },
  contentContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.xs,
  },
  title: {
    fontSize: Layout.typography.fontSizes.l,
    fontWeight: '600',
    color: Colors.dark.text,
    flex: 1,
    marginRight: Layout.spacing.s,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: Colors.dark.textSecondary,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.s,
    paddingVertical: Layout.spacing.xs / 2,
    borderRadius: Layout.borderRadius.full,
    backgroundColor: Colors.dark.backgroundSecondary,
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Layout.spacing.xs,
  },
  priorityText: {
    fontSize: Layout.typography.fontSizes.xs,
    color: Colors.dark.textSecondary,
    fontWeight: '500',
  },
  description: {
    fontSize: Layout.typography.fontSizes.s,
    color: Colors.dark.textSecondary,
    marginBottom: Layout.spacing.m,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Layout.spacing.m,
  },
  dueDate: {
    marginLeft: 4,
    fontSize: Layout.typography.fontSizes.xs,
    color: Colors.dark.textSecondary,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.s,
    paddingVertical: Layout.spacing.xs / 2,
    borderRadius: Layout.borderRadius.full,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Layout.spacing.xs,
  },
  categoryText: {
    fontSize: Layout.typography.fontSizes.xs,
    color: Colors.dark.textSecondary,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: Layout.spacing.xs,
    marginLeft: Layout.spacing.s,
  },
});

export default TaskItem;