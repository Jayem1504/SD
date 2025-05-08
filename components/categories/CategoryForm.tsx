import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Palette } from 'lucide-react-native';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useCategories } from '../../context/CategoryContext';
import { CategoryFormData, FormErrors } from '../../types';
import { validateCategoryForm } from '../../utils/validationUtils';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

// Predefined colors for category selection
const CATEGORY_COLORS = [
  '#8B5CF6', // Purple (primary)
  '#14B8A6', // Teal (accent)
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#EF4444', // Red
  '#3B82F6', // Blue
];

const CategoryForm: React.FC = () => {
  const { addCategory } = useCategories();
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    color: CATEGORY_COLORS[0],
  });

  const handleChange = (key: keyof CategoryFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
    
    // Clear error for this field if it exists
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const handleSelectColor = (color: string) => {
    handleChange('color', color);
  };

  const handleSubmit = async () => {
    // Validate form
    const validationErrors = validateCategoryForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      addCategory(formData);
      router.back();
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Input
        label="Category Name"
        placeholder="Enter category name"
        value={formData.name}
        onChangeText={(value) => handleChange('name', value)}
        error={errors.name}
        leftIcon={<Palette size={20} color={Colors.dark.textSecondary} />}
      />

      <View style={styles.colorSection}>
        <Text style={styles.colorLabel}>Select Color</Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.colorPalette}
        >
          {CATEGORY_COLORS.map(color => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorOption,
                { backgroundColor: color },
                formData.color === color && styles.selectedColor,
              ]}
              onPress={() => handleSelectColor(color)}
            />
          ))}
        </ScrollView>
        
        {errors.color && (
          <Text style={styles.errorText}>{errors.color}</Text>
        )}
      </View>

      <View style={styles.previewSection}>
        <Text style={styles.previewLabel}>Preview</Text>
        <View 
          style={[
            styles.categoryPreview,
            { backgroundColor: formData.color + '20' }
          ]}
        >
          <View 
            style={[
              styles.previewColorIndicator,
              { backgroundColor: formData.color }
            ]}
          />
          <Text style={styles.previewText}>
            {formData.name || 'New Category'}
          </Text>
        </View>
      </View>

      <View style={styles.buttons}>
        <Button
          title="Create Category"
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
  colorSection: {
    marginBottom: Layout.spacing.l,
  },
  colorLabel: {
    fontSize: Layout.typography.fontSizes.s,
    marginBottom: Layout.spacing.xs,
    fontWeight: '500',
    color: Colors.dark.text,
  },
  colorPalette: {
    flexDirection: 'row',
    paddingVertical: Layout.spacing.s,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: Layout.spacing.m,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: Colors.dark.text,
  },
  previewSection: {
    marginBottom: Layout.spacing.xl,
  },
  previewLabel: {
    fontSize: Layout.typography.fontSizes.s,
    marginBottom: Layout.spacing.s,
    fontWeight: '500',
    color: Colors.dark.text,
  },
  categoryPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.m,
    paddingVertical: Layout.spacing.m,
    borderRadius: Layout.borderRadius.m,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  previewColorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: Layout.spacing.m,
  },
  previewText: {
    fontSize: Layout.typography.fontSizes.m,
    color: Colors.dark.text,
    fontWeight: '600',
  },
  buttons: {
    marginTop: 'auto',
  },
  cancelButton: {
    marginTop: Layout.spacing.m,
  },
  errorText: {
    color: Colors.dark.error,
    fontSize: Layout.typography.fontSizes.xs,
    marginTop: Layout.spacing.xs,
  },
});

export default CategoryForm;