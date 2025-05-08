import { Stack } from 'expo-router';
import Colors from '../../../constants/Colors';

export default function TasksLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.dark.background,
        },
        headerTintColor: Colors.dark.text,
        headerTitleStyle: {
          fontFamily: 'Inter-SemiBold',
        },
        headerBackTitleVisible: false,
        contentStyle: {
          backgroundColor: Colors.dark.background,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'All Tasks',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Task Details',
        }}
      />
      <Stack.Screen
        name="new"
        options={{
          title: 'New Task',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="edit/[id]"
        options={{
          title: 'Edit Task',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}