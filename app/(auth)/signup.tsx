import React from 'react';
import { View, Text, StyleSheet, Platform, SafeAreaView, KeyboardAvoidingView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import SignupForm from '../../components/auth/SignupForm';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

export default function SignupScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.logo}>SyncUp</Text>
              <Text style={styles.tagline}>Your tasks, simplified.</Text>
            </View>
            
            <View style={styles.formContainer}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Sign up to get started</Text>
              
              <SignupForm />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: Layout.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Layout.spacing.xxl,
  },
  logo: {
    fontSize: 42,
    fontFamily: 'Inter-Bold',
    color: Colors.dark.text,
    marginBottom: Layout.spacing.xs,
  },
  tagline: {
    fontSize: Layout.typography.fontSizes.m,
    fontFamily: 'Inter-Regular',
    color: Colors.dark.textSecondary,
  },
  formContainer: {
    width: '100%',
  },
  title: {
    fontSize: Layout.typography.fontSizes.xxl,
    fontFamily: 'Inter-Bold',
    color: Colors.dark.text,
    marginBottom: Layout.spacing.xs,
  },
  subtitle: {
    fontSize: Layout.typography.fontSizes.m,
    fontFamily: 'Inter-Regular',
    color: Colors.dark.textSecondary,
    marginBottom: Layout.spacing.xl,
  },
});