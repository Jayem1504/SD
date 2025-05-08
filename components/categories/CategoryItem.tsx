import React from 'react';
import { Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withTiming,
  FadeIn
} from 'react-native-reanimated';
import { Category } from '../../types';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

interface CategoryItemProps {
  category: Category;
  isSelected: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  isSelected,
  onPress,
  style,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        isSelected ? category.color + '20' : Colors.dark.backgroundSecondary,
        { duration: 200 }
      ),
      borderColor: withTiming(
        isSelected ? category.color : Colors.dark.border,
        { duration: 200 }
      ),
    };
  });

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={[styles.container, animatedStyle, style]}
    >
      <TouchableOpacity
        style={styles.touchable}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Animated.View 
          style={[
            styles.colorIndicator,
            { backgroundColor: category.color },
          ]}
        />
        <Text 
          style={[
            styles.text,
            isSelected && { color: Colors.dark.text, fontWeight: '600' }
          ]}
        >
          {category.name}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: Layout.borderRadius.m,
    borderWidth: 1,
    overflow: 'hidden',
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.m,
    paddingVertical: Layout.spacing.s,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Layout.spacing.s,
  },
  text: {
    color: Colors.dark.textSecondary,
    fontSize: Layout.typography.fontSizes.s,
  },
});

export default CategoryItem;