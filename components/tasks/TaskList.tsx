import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  FadeIn,
  FadeOut
} from 'react-native-reanimated';
import TaskItem from './TaskItem';
import { useTasks } from '../../context/TaskContext';
import { useCategories } from '../../context/CategoryContext';
import { Task } from '../../types';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

interface TaskListProps {
  categoryId?: string;
  showCategory?: boolean;
  filterCompleted?: boolean;
}

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const TaskList: React.FC<TaskListProps> = ({ 
  categoryId,
  showCategory = true,
  filterCompleted = true
}) => {
  const { tasks, isLoading } = useTasks();
  const { getCategoryById } = useCategories();
  const [refreshing, setRefreshing] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    // Filter tasks based on category and completion status
    let filtered = [...tasks];
    
    if (categoryId) {
      filtered = filtered.filter(task => task.categoryId === categoryId);
    }
    
    if (filterCompleted) {
      // Show incomplete tasks first, then completed tasks
      filtered.sort((a, b) => {
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;
        
        // Sort by created date for items with the same completion status
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    } else {
      // Sort by created date only
      filtered.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    
    setFilteredTasks(filtered);
    opacity.value = withTiming(1, { duration: 500 });
  }, [tasks, categoryId, filterCompleted]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const onRefresh = async () => {
    setRefreshing(true);
    // In a real app, this would refetch tasks from the backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.dark.tint} />
        <Text style={styles.loadingText}>Loading tasks...</Text>
      </View>
    );
  }

  if (filteredTasks.length === 0) {
    const category = categoryId ? getCategoryById(categoryId) : null;
    const emptyMessage = category 
      ? `No tasks in ${category.name}`
      : 'No tasks found';

    return (
      <Animated.View 
        style={[styles.emptyContainer, animatedStyle]}
        entering={FadeIn.duration(500)}
        exiting={FadeOut.duration(300)}
      >
        <Text style={styles.emptyText}>{emptyMessage}</Text>
        <Text style={styles.emptySubtext}>
          Create a new task to get started
        </Text>
      </Animated.View>
    );
  }

  return (
    <AnimatedFlatList
      data={filteredTasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Animated.View
          entering={FadeIn.duration(500).delay(50 * filteredTasks.indexOf(item))}
        >
          <TaskItem task={item} showCategory={showCategory} />
        </Animated.View>
      )}
      contentContainerStyle={styles.listContent}
      style={[styles.list, animatedStyle]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.dark.tint}
          colors={[Colors.dark.tint]}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    padding: Layout.spacing.m,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Layout.spacing.m,
    color: Colors.dark.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.xl,
  },
  emptyText: {
    fontSize: Layout.typography.fontSizes.xl,
    fontWeight: '600',
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: Layout.spacing.s,
  },
  emptySubtext: {
    fontSize: Layout.typography.fontSizes.m,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
});

export default TaskList;