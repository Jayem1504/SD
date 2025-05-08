import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  ...rest
}) => {
  const getButtonStyles = (): ViewStyle => {
    const buttonStyles: ViewStyle[] = [styles.button, styles[variant], styles[size]];
    
    if (fullWidth) {
      buttonStyles.push(styles.fullWidth);
    }
    
    if (disabled || loading) {
      buttonStyles.push(styles.disabled);
    }
    
    if (style) {
      buttonStyles.push(style);
    }
    
    return buttonStyles as ViewStyle;
  };

  const getTextStyles = (): TextStyle => {
    const textStyles: TextStyle[] = [styles.text, styles[`${variant}Text`]];
    
    if (textStyle) {
      textStyles.push(textStyle);
    }
    
    return textStyles as TextStyle;
  };

  return (
    <TouchableOpacity
      style={getButtonStyles()}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? Colors.dark.button : Colors.dark.buttonText}
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text style={getTextStyles()}>{title}</Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Layout.borderRadius.m,
    gap: Layout.spacing.s,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
  // Variants
  primary: {
    backgroundColor: Colors.dark.button,
  },
  primaryText: {
    color: Colors.dark.buttonText,
  },
  secondary: {
    backgroundColor: Colors.dark.backgroundSecondary,
  },
  secondaryText: {
    color: Colors.dark.text,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  outlineText: {
    color: Colors.dark.text,
  },
  danger: {
    backgroundColor: Colors.dark.error,
  },
  dangerText: {
    color: Colors.dark.buttonText,
  },
  success: {
    backgroundColor: Colors.dark.success,
  },
  successText: {
    color: Colors.dark.buttonText,
  },
  // Sizes
  small: {
    paddingVertical: Layout.spacing.xs,
    paddingHorizontal: Layout.spacing.m,
  },
  medium: {
    paddingVertical: Layout.spacing.s,
    paddingHorizontal: Layout.spacing.l,
  },
  large: {
    paddingVertical: Layout.spacing.m,
    paddingHorizontal: Layout.spacing.xl,
  },
});

export default Button;