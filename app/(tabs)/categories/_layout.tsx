import { Stack } from 'expo-router';
import Colors from '../../../constants/Colors';

export default function CategoriesLayout() {
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
          title: 'Categories',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="new"
        options={{
          title: 'New Category',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}