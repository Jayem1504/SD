import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { CirclePlus as PlusCircle, Search } from 'lucide-react-native';
import TaskList from '../../../components/tasks/TaskList';
import CategoryList from '../../../components/categories/CategoryList';
import Input from '../../../components/ui/Input';
import Colors from '../../../constants/Colors';
import Layout from '../../../constants/Layout';

export default function TasksScreen() {
  const params = useLocalSearchParams<{ categoryId?: string }>();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    if (params.categoryId) {
      setSelectedCategoryId(params.categoryId);
    }
  }, [params.categoryId]);

  const handleNewTask = () => {
    router.navigate('/(tabs)/tasks/new');
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleNewTask}
        >
          <PlusCircle size={24} color={Colors.dark.text} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={styles.searchInputContainer}
          leftIcon={<Search size={20} color={Colors.dark.textSecondary} />}
        />
      </View>
      
      <View style={styles.categoriesContainer}>
        <CategoryList
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleSelectCategory}
        />
      </View>
      
      <View style={styles.tasksContainer}>
        <TaskList
          categoryId={selectedCategoryId === 'all' ? undefined : selectedCategoryId}
          showCategory={selectedCategoryId === 'all'}
        />
      </View>
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
  searchContainer: {
    paddingHorizontal: Layout.spacing.xl,
    marginBottom: Layout.spacing.s,
  },
  searchInputContainer: {
    marginBottom: 0,
  },
  categoriesContainer: {
    marginBottom: Layout.spacing.xs,
  },
  tasksContainer: {
    flex: 1,
  },
});