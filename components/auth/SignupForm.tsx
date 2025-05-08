import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Mail, Lock, User } from 'lucide-react-native';
import { router } from 'expo-router';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { validateSignupForm } from '../../utils/validationUtils';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
import { FormErrors } from '../../types';

const SignupForm: React.FC = () => {
  const { signup, isLoading, error: authError } = useAuth();
  
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSignup = async () => {
    const validationErrors = validateSignupForm(
      displayName,
      email,
      password,
      confirmPassword
    );
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setErrors({});
    await signup(email, password, displayName);
  };

  const navigateToLogin = () => {
    router.navigate('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        {authError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{authError}</Text>
          </View>
        )}

        <Input
          label="Username"
          placeholder="Choose a username"
          value={displayName}
          onChangeText={setDisplayName}
          autoCapitalize="none"
          error={errors.displayName}
          leftIcon={<User size={20} color={Colors.dark.textSecondary} />}
        />

        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
          leftIcon={<Mail size={20} color={Colors.dark.textSecondary} />}
        />

        <Input
          label="Password"
          placeholder="Create a password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={errors.password}
          leftIcon={<Lock size={20} color={Colors.dark.textSecondary} />}
        />

        <Input
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          error={errors.confirmPassword}
          leftIcon={<Lock size={20} color={Colors.dark.textSecondary} />}
        />

        <Button
          title="Create Account"
          onPress={handleSignup}
          loading={isLoading}
          fullWidth
          style={styles.signupButton}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={navigateToLogin}>
            <Text style={styles.loginLink}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  form: {
    width: '100%',
  },
  signupButton: {
    marginTop: Layout.spacing.m,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Layout.spacing.xl,
  },
  footerText: {
    color: Colors.dark.textSecondary,
    marginRight: Layout.spacing.xs,
  },
  loginLink: {
    color: Colors.dark.tint,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: Layout.borderRadius.m,
    padding: Layout.spacing.m,
    marginBottom: Layout.spacing.m,
    borderLeftWidth: 4,
    borderLeftColor: Colors.dark.error,
  },
  errorText: {
    color: Colors.dark.error,
  },
});

export default SignupForm;