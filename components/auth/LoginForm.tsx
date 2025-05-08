import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Mail, Lock } from 'lucide-react-native';
import { router } from 'expo-router';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { validateLoginForm } from '../../utils/validationUtils';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
import { FormErrors } from '../../types';

const LoginForm: React.FC = () => {
  const { login, isLoading, error: authError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const handleLogin = async () => {
    // Validate form
    const validationErrors = validateLoginForm(email, password);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Clear errors
    setErrors({});
    
    // Attempt login
    await login(email, password);
  };

  const navigateToSignup = () => {
    router.navigate('/(auth)/signup');
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
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
          leftIcon={<Mail size={20} color={Colors.dark.textSecondary} />}
          containerStyle={styles.input}
        />

        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={errors.password}
          leftIcon={<Lock size={20} color={Colors.dark.textSecondary} />}
          containerStyle={styles.input}
        />

        <Button
          title="Log In"
          onPress={handleLogin}
          loading={isLoading}
          fullWidth
          style={styles.loginButton}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={navigateToSignup}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: Layout.spacing.m,
  },
  loginButton: {
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
    fontFamily: 'Inter-Regular',
  },
  signupLink: {
    color: Colors.dark.tint,
    fontFamily: 'Inter-Medium',
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
    fontFamily: 'Inter-Regular',
  },
});

export default LoginForm;