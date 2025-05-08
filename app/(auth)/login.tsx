import React from 'react';
import { View, Text, StyleSheet, Platform, SafeAreaView, KeyboardAvoidingView, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import LoginForm from '../../components/auth/LoginForm';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

export default function LoginScreen() {
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
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg' }}
                style={styles.headerImage}
              />
              <View style={styles.overlay} />
              <View style={styles.logoContainer}>
                <Text style={styles.logo}>SyncUp</Text>
                <Text style={styles.tagline}>Your tasks, simplified.</Text>
              </View>
            </View>
            
            <View style={styles.formContainer}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Log in to your account</Text>
              
              <LoginForm />
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
  },
  header: {
    height: 300,
    position: 'relative',
    overflow: 'hidden',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  logoContainer: {
    position: 'absolute',
    bottom: Layout.spacing.xl,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
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
    padding: Layout.spacing.xl,
    backgroundColor: Colors.dark.background,
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