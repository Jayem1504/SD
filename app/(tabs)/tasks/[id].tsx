import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CreditCard as Edit2, Trash2, CircleCheck as CheckCircle, Circle, Tag, MessageSquare } from 'lucide-react-native';
import { useTasks } from '../../../context/TaskContext';
import { useCategories } from '../../../context/CategoryContext';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Colors from '../../../constants/Colors';
import Layout from '../../../constants/Layout';
import { TaskPriority } from '../../../types';

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTaskById, toggleTaskCompletion, deleteTask } = useTasks();
  const { getCategoryById } = useCategories();
  
  const task = getTaskById(id);
  
  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.dark.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Task Details</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Task not found</Text>
          <Button 
            title="Go Back" 
            onPress={() => router.back()}
            variant="outline"
            style={styles.goBackButton}
          />
        </View>
      </SafeAreaView>
    );
  }
  
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

  const handleToggleCompletion = () => {
    toggleTaskCompletion(task.id);
  };

  const handleEdit = () => {
    router.navigate(`/(tabs)/tasks/edit/${task.id}`);
  };

  const handleDelete = () => {
    deleteTask(task.id);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Details</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        <Card style={styles.taskCard}>
          <View style={styles.taskHeader}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <View style={styles.taskActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleEdit}
              >
                <Edit2 size={20} color={Colors.dark.text} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleDelete}
              >
                <Trash2 size={20} color={Colors.dark.error} />
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.completionButton}
            onPress={handleToggleCompletion}
          >
            {task.completed ? (
              <>
                <CheckCircle size={24} color={Colors.dark.success} />
                <Text style={styles.completedText}>Completed</Text>
              </>
            ) : (
              <>
                <Circle size={24} color={Colors.dark.border} />
                <Text style={styles.incompleteText}>Mark as complete</Text>
              </>
            )}
          </TouchableOpacity>
          
          {task.description ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{task.description}</Text>
            </View>
          ) : null}
          
          <View style={styles.metaSection}>
            <View style={styles.metaItem}>
              <View 
                style={[
                  styles.metaIcon,
                  { backgroundColor: getPriorityColor(task.priority) + '20' }
                ]}
              >
                <View 
                  style={[
                    styles.priorityIndicator,
                    { backgroundColor: getPriorityColor(task.priority) }
                  ]}
                />
              </View>
              <View>
                <Text style={styles.metaLabel}>Priority</Text>
                <Text style={styles.metaValue}>{task.priority}</Text>
              </View>
            </View>
            
            <View style={styles.metaItem}>
              <View 
                style={[
                  styles.metaIcon,
                  { backgroundColor: category?.color + '20' || Colors.dark.backgroundSecondary }
                ]}
              >
                <Tag size={20} color={category?.color || Colors.dark.text} />
              </View>
              <View>
                <Text style={styles.metaLabel}>Category</Text>
                <Text style={styles.metaValue}>
                  {category?.name || 'Uncategorized'}
                </Text>
              </View>
            </View>
          </View>
          
          {task.notes ? (
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <MessageSquare size={20} color={Colors.dark.textSecondary} />
                <Text style={styles.sectionTitle}>Notes</Text>
              </View>
              <View style={styles.notesContainer}>
                <Text style={styles.notes}>{task.notes}</Text>
              </View>
            </View>
          ) : null}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.m,
    height: 56,
  },
  backButton: {
    padding: Layout.spacing.s,
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: Layout.typography.fontSizes.l,
    color: Colors.dark.text,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  taskCard: {
    margin: Layout.spacing.l,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.m,
  },
  taskTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: Layout.typography.fontSizes.xl,
    color: Colors.dark.text,
    flex: 1,
  },
  taskActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: Layout.spacing.s,
    marginLeft: Layout.spacing.xs,
  },
  completionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.backgroundSecondary,
    padding: Layout.spacing.m,
    borderRadius: Layout.borderRadius.m,
    marginBottom: Layout.spacing.l,
  },
  completedText: {
    marginLeft: Layout.spacing.m,
    fontFamily: 'Inter-Medium',
    color: Colors.dark.success,
  },
  incompleteText: {
    marginLeft: Layout.spacing.m,
    fontFamily: 'Inter-Medium',
    color: Colors.dark.text,
  },
  section: {
    marginBottom: Layout.spacing.l,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.s,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: Layout.typography.fontSizes.m,
    color: Colors.dark.text,
    marginLeft: Layout.spacing.xs,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: Layout.typography.fontSizes.m,
    color: Colors.dark.textSecondary,
    lineHeight: 24,
  },
  metaSection: {
    marginBottom: Layout.spacing.l,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.m,
  },
  metaIcon: {
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
  metaLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: Layout.typography.fontSizes.s,
    color: Colors.dark.textSecondary,
    marginBottom: 2,
  },
  metaValue: {
    fontFamily: 'Inter-Medium',
    fontSize: Layout.typography.fontSizes.m,
    color: Colors.dark.text,
  },
  notesContainer: {
    backgroundColor: Colors.dark.backgroundSecondary,
    padding: Layout.spacing.m,
    borderRadius: Layout.borderRadius.m,
  },
  notes: {
    fontFamily: 'Inter-Regular',
    fontSize: Layout.typography.fontSizes.m,
    color: Colors.dark.text,
    lineHeight: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.xl,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: Layout.typography.fontSizes.l,
    color: Colors.dark.textSecondary,
    marginBottom: Layout.spacing.l,
  },
  goBackButton: {
    marginTop: Layout.spacing.l,
  },
});