import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  // While loading, don't render anything
  if (isLoading) {
    return null;
  }

  // Once loaded, redirect appropriately
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}