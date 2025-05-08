import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import CategoryItem from './CategoryItem';
import { useCategories } from '../../context/CategoryContext';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

interface CategoryListProps {
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  horizontal?: boolean;
}

const CategoryList: React.FC<CategoryListProps> = ({
  selectedCategoryId,
  onSelectCategory,
  horizontal = true,
}) => {
  const { categories, isLoading } = useCategories();

  const handleAddCategory = () => {
    router.navigate('/(tabs)/categories/new');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={Colors.dark.tint} />
      </View>
    );
  }

  return (
    <ScrollView
      horizontal={horizontal}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[
        styles.container,
        !horizontal && styles.verticalContainer,
      ]}
    >
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          isSelected={category.id === selectedCategoryId}
          onPress={() => onSelectCategory(category.id)}
          style={horizontal ? styles.horizontalItem : styles.verticalItem}
        />
      ))}
      
      <TouchableOpacity
        style={[
          styles.addButton,
          horizontal ? styles.horizontalItem : styles.verticalItem,
        ]}
        onPress={handleAddCategory}
      >
        <Plus size={20} color={Colors.dark.text} />
        <Text style={styles.addButtonText}>New Category</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Layout.spacing.m,
    paddingVertical: Layout.spacing.m,
  },
  verticalContainer: {
    padding: Layout.spacing.m,
  },
  horizontalItem: {
    marginRight: Layout.spacing.m,
  },
  verticalItem: {
    marginBottom: Layout.spacing.m,
    width: '100%',
  },
  loadingContainer: {
    padding: Layout.spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: Layout.borderRadius.m,
    paddingHorizontal: Layout.spacing.m,
    paddingVertical: Layout.spacing.s,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderStyle: 'dashed',
  },
  addButtonText: {
    marginLeft: Layout.spacing.xs,
    color: Colors.dark.text,
    fontWeight: '500',
  },
});

export default CategoryList;