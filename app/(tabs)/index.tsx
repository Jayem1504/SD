import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  Platform,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { CirclePlus as PlusCircle } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { useCategories } from '../../context/CategoryContext';
import TaskList from '../../components/tasks/TaskList';
import CategoryList from '../../components/categories/CategoryList';
import Card from '../../components/ui/Card';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
import { TaskPriority } from '../../types';

export default function DashboardScreen() {
  const { user } = useAuth();
  const { tasks } = useTasks();
  const { categories } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

  const getCompletedTasksCount = () => {
    return tasks.filter(task => task.completed).length;
  };

  const getPendingTasksCount = () => {
    return tasks.filter(task => !task.completed).length;
  };

  const getHighPriorityTasksCount = () => {
    return tasks.filter(
      task => task.priority === TaskPriority.HIGH && !task.completed
    ).length;
  };

  const handleNewTask = () => {
    router.navigate('/(tabs)/tasks/new');
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Animated.View 
            entering={FadeIn.duration(500)}
            style={styles.greetingContainer}
          >
            <Text style={styles.greeting}>
              {getGreeting()},
            </Text>
            <Text style={styles.username}>
              {user?.displayName || 'User'}
            </Text>
          </Animated.View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleNewTask}
          >
            <PlusCircle size={24} color={Colors.dark.text} />
          </TouchableOpacity>
        </View>

        <Animated.View 
          entering={FadeIn.duration(500).delay(100)}
          style={styles.statsContainer}
        >
          <Card style={styles.statsCard}>
            <Text style={styles.statsTitle}>Task Summary</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{tasks.length}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{getPendingTasksCount()}</Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{getCompletedTasksCount()}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: Colors.dark.priorityHigh }]}>
                  {getHighPriorityTasksCount()}
                </Text>
                <Text style={styles.statLabel}>High Priority</Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        <Animated.View 
          entering={FadeIn.duration(500).delay(200)}
        >
          <Text style={styles.sectionTitle}>Categories</Text>
          <CategoryList
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={handleSelectCategory}
          />
        </Animated.View>

        <Animated.View 
          entering={FadeIn.duration(500).delay(300)}
          style={styles.tasksSection}
        >
          <Text style={styles.sectionTitle}>
            {selectedCategoryId === 'all' 
              ? 'All Tasks' 
              : categories.find(c => c.id === selectedCategoryId)?.name || 'Tasks'
            }
          </Text>
          <TaskList
            categoryId={selectedCategoryId === 'all' ? undefined : selectedCategoryId}
            showCategory={selectedCategoryId === 'all'}
          />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
    paddingTop: Platform.OS === 'android' ? Layout.spacing.xl : Layout.spacing.l,
    paddingBottom: Layout.spacing.m,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontFamily: 'Inter-Regular',
    fontSize: Layout.typography.fontSizes.l,
    color: Colors.dark.textSecondary,
  },
  username: {
    fontFamily: 'Inter-Bold',
    fontSize: Layout.typography.fontSizes.xxl,
    color: Colors.dark.text,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.dark.button,
    justifyContent: 'center',
    alignItems: 'center',
    ...Layout.shadows.medium,
  },
  statsContainer: {
    paddingHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.xl,
  },
  statsCard: {
    padding: Layout.spacing.m,
  },
  statsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: Layout.typography.fontSizes.m,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.m,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '45%',
    backgroundColor: Colors.dark.backgroundSecondary,
    padding: Layout.spacing.m,
    borderRadius: Layout.borderRadius.m,
    marginBottom: Layout.spacing.m,
  },
  statNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: Layout.typography.fontSizes.xl,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.xs,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: Layout.typography.fontSizes.s,
    color: Colors.dark.textSecondary,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: Layout.typography.fontSizes.l,
    color: Colors.dark.text,
    marginHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.s,
  },
  tasksSection: {
    flex: 1,
    marginTop: Layout.spacing.m,
    paddingBottom: Layout.spacing.xxl,
  },
});