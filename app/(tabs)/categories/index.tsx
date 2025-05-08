import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Platform,
  FlatList,
} from 'react-native';
import { router } from 'expo-router';
import { CirclePlus as PlusCircle } from 'lucide-react-native';
import { useCategories } from '../../../context/CategoryContext';
import { useTasks } from '../../../context/TaskContext';
import Card from '../../../components/ui/Card';
import Colors from '../../../constants/Colors';
import Layout from '../../../constants/Layout';

export default function CategoriesScreen() {
  const { categories } = useCategories();
  const { tasks } = useTasks();

  const handleAddCategory = () => {
    router.navigate('/(tabs)/categories/new');
  };

  const handleSelectCategory = (categoryId: string) => {
    router.push({
      pathname: '/(tabs)/tasks',
      params: { categoryId }
    });
  };

  const getTaskCountByCategory = (categoryId: string) => {
    return tasks.filter(task => task.categoryId === categoryId).length;
  };

  const getPendingTaskCountByCategory = (categoryId: string) => {
    return tasks.filter(task => task.categoryId === categoryId && !task.completed).length;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddCategory}
        >
          <PlusCircle size={24} color={Colors.dark.text} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Card 
            pressable 
            onPress={() => handleSelectCategory(item.id)}
            style={styles.categoryCard}
          >
            <View style={styles.categoryHeader}>
              <View style={styles.categoryTitleRow}>
                <View 
                  style={[
                    styles.categoryColor, 
                    { backgroundColor: item.color }
                  ]}
                />
                <Text style={styles.categoryName}>{item.name}</Text>
              </View>
              
              <View style={styles.stats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{getTaskCountByCategory(item.id)}</Text>
                  <Text style={styles.statLabel}>Tasks</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{getPendingTaskCountByCategory(item.id)}</Text>
                  <Text style={styles.statLabel}>Pending</Text>
                </View>
              </View>
            </View>
          </Card>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No categories found</Text>
            <Text style={styles.emptySubtext}>
              Create a new category to organize your tasks
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={handleAddCategory}
            >
              <Text style={styles.emptyButtonText}>Add Category</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
    paddingTop: Platform.OS === 'android' ? Layout.spacing.xl : Layout.spacing.m,
    paddingBottom: Layout.spacing.m,
  },
  title: {
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
  listContent: {
    padding: Layout.spacing.l,
  },
  categoryCard: {
    marginBottom: Layout.spacing.m,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: Layout.spacing.s,
  },
  categoryName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: Layout.typography.fontSizes.l,
    color: Colors.dark.text,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    marginLeft: Layout.spacing.m,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: Layout.typography.fontSizes.m,
    color: Colors.dark.text,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: Layout.typography.fontSizes.xs,
    color: Colors.dark.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Layout.spacing.xl,
    marginTop: Layout.spacing.xxl,
  },
  emptyText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: Layout.typography.fontSizes.xl,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.s,
  },
  emptySubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: Layout.typography.fontSizes.m,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginBottom: Layout.spacing.xl,
  },
  emptyButton: {
    backgroundColor: Colors.dark.button,
    paddingVertical: Layout.spacing.m,
    paddingHorizontal: Layout.spacing.xl,
    borderRadius: Layout.borderRadius.m,
  },
  emptyButtonText: {
    fontFamily: 'Inter-Medium',
    color: Colors.dark.text,
  },
});