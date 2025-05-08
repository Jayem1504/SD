import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputContainerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  secureTextEntry?: boolean;
  multiline?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  labelStyle,
  inputContainerStyle,
  inputStyle,
  leftIcon,
  rightIcon,
  secureTextEntry = false,
  multiline = false,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    rest.onFocus && rest.onFocus;
  };

  const handleBlur = () => {
    setIsFocused(false);
    rest.onBlur && rest.onBlur;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focusedInput,
          error && styles.errorInput,
          multiline && styles.multilineInput,
          inputContainerStyle,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || secureTextEntry) && styles.inputWithRightIcon,
            multiline && styles.multilineTextInput,
            inputStyle,
          ]}
          placeholderTextColor={Colors.dark.placeholderText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry && !showPassword}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          {...rest}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={togglePasswordVisibility}
          >
            {showPassword ? (
              <EyeOff size={20} color={Colors.dark.textSecondary} />
            ) : (
              <Eye size={20} color={Colors.dark.textSecondary} />
            )}
          </TouchableOpacity>
        )}
        
        {rightIcon && !secureTextEntry && (
          <View style={styles.rightIcon}>{rightIcon}</View>
        )}
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    color: Colors.dark.text,
    fontSize: Layout.typography.fontSizes.s,
    marginBottom: Layout.spacing.xs,
    fontFamily: 'Inter-Medium',
  },
  inputContainer: {
    backgroundColor: Colors.dark.backgroundSecondary,
    borderRadius: Layout.borderRadius.m,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    flex: 1,
    color: Colors.dark.text,
    paddingVertical: Platform.OS === 'ios' ? Layout.spacing.m : Layout.spacing.s,
    paddingHorizontal: Layout.spacing.m,
    fontSize: Layout.typography.fontSizes.m,
    fontFamily: 'Inter-Regular',
  },
  inputWithLeftIcon: {
    paddingLeft: Layout.spacing.xs,
  },
  inputWithRightIcon: {
    paddingRight: Layout.spacing.xs,
  },
  leftIcon: {
    paddingLeft: Layout.spacing.m,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIcon: {
    paddingRight: Layout.spacing.m,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusedInput: {
    borderColor: Colors.dark.tint,
  },
  errorInput: {
    borderColor: Colors.dark.error,
  },
  errorText: {
    color: Colors.dark.error,
    fontSize: Layout.typography.fontSizes.xs,
    marginTop: Layout.spacing.xs,
    fontFamily: 'Inter-Regular',
  },
  multilineInput: {
    minHeight: 100,
  },
  multilineTextInput: {
    minHeight: 100,
    maxHeight: 200,
  },
});

export default Input;