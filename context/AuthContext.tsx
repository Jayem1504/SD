import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';
import { User, AuthState } from '../types';

interface ProfileUpdateData {
  displayName: string;
  email: string;
  avatar?: string;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
}

const defaultAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setAuthState({
          user: {
            id: session.user.id,
            email: session.user.email!,
            displayName: session.user.user_metadata.displayName || session.user.email!.split('@')[0],
            avatar: session.user.user_metadata.avatar,
          },
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;

      router.replace('/(tabs)');
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
    }
  };

  const signup = async (email: string, password: string, displayName: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            displayName,
          },
        },
      });
      
      if (error) throw error;

      router.replace('/(tabs)');
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      
      router.replace('/(auth)/login');
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        error: error.message,
      }));
    }
  };

  const updateProfile = async (data: ProfileUpdateData) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { error } = await supabase.auth.updateUser({
        email: data.email,
        data: {
          displayName: data.displayName,
          avatar: data.avatar,
        },
      });
      
      if (error) throw error;

      if (authState.user) {
        const updatedUser: User = {
          ...authState.user,
          displayName: data.displayName,
          email: data.email,
          avatar: data.avatar || authState.user.avatar,
        };
        
        setAuthState(prev => ({
          ...prev,
          user: updatedUser,
          isLoading: false,
          error: null,
        }));
      }
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};