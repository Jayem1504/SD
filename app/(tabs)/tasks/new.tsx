import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import TaskForm from '../../../components/tasks/TaskForm';
import Colors from '../../../constants/Colors';
import Layout from '../../../constants/Layout';

export default function NewTaskScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>New Task</Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <X size={24} color={Colors.dark.text} />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <TaskForm />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.xl,
    height: 56,
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: Layout.typography.fontSizes.l,
    color: Colors.dark.text,
  },
  closeButton: {
    padding: Layout.spacing.s,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});