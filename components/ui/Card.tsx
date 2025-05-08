import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: 'none' | 'small' | 'medium' | 'large';
  variant?: 'default' | 'outlined';
  pressable?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  elevation = 'small',
  variant = 'default',
  pressable = false,
  ...rest
}) => {
  const cardStyle = [
    styles.card,
    variant === 'outlined' && styles.outlined,
    elevation !== 'none' && styles[elevation],
    style,
  ];

  if (pressable) {
    return (
      <TouchableOpacity
        style={cardStyle}
        activeOpacity={0.8}
        {...rest}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.card,
    borderRadius: Layout.borderRadius.m,
    padding: Layout.spacing.m,
    marginVertical: Layout.spacing.s,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  small: {
    ...Layout.shadows.small,
  },
  medium: {
    ...Layout.shadows.medium,
  },
  large: {
    ...Layout.shadows.large,
  },
});

export default Card;