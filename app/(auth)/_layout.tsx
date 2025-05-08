import { Text, View, StyleSheet, Platform, Image } from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

export default function AuthLayout() {
  return (
    <LinearGradient
      colors={['#080415', '#131022', '#191627']}
      style={styles.container}
    >
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
      </Stack>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});