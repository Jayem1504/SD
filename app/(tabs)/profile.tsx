import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LogOut, User } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import ProfileEditor from '../../components/profile/ProfileEditor';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = React.useState(false);

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  if (isEditing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Edit Profile</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsEditing(false)}
          >
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <ProfileEditor onComplete={() => setIsEditing(false)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>
      
      <View style={styles.content}>
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user?.displayName || 'User'}</Text>
            </View>
          </View>
        </Card>
        
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <Card style={styles.settingsCard}>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => setIsEditing(true)}
            >
              <View style={styles.settingIconContainer}>
                <User size={20} color={Colors.dark.textSecondary} />
              </View>
              <Text style={styles.settingText}>Edit Username</Text>
            </TouchableOpacity>
          </Card>
        </View>
        
        <View style={styles.logoutContainer}>
          <Button
            title="Log Out"
            variant="outline"
            leftIcon={<LogOut size={20} color={Colors.dark.text} />}
            onPress={handleLogout}
            fullWidth
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
    paddingTop: Platform.OS === 'android' ? Layout.spacing.xl : Layout.spacing.m,
    paddingBottom: Layout.spacing.m,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: Layout.typography.fontSizes.xxl,
    color: Colors.dark.text,
  },
  closeButton: {
    padding: Layout.spacing.s,
  },
  closeButtonText: {
    color: Colors.dark.tint,
    fontFamily: 'Inter-Medium',
    fontSize: Layout.typography.fontSizes.m,
  },
  content: {
    flex: 1,
    padding: Layout.spacing.l,
  },
  profileCard: {
    padding: Layout.spacing.l,
    marginBottom: Layout.spacing.l,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.dark.tint,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.l,
  },
  avatarText: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.dark.text,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: Layout.typography.fontSizes.l,
    color: Colors.dark.text,
  },
  settingsSection: {
    marginBottom: Layout.spacing.l,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: Layout.typography.fontSizes.m,
    color: Colors.dark.text,
    marginBottom: Layout.spacing.s,
    marginLeft: Layout.spacing.s,
  },
  settingsCard: {
    padding: 0,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.m,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: Layout.borderRadius.m,
    backgroundColor: Colors.dark.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.m,
  },
  settingText: {
    fontFamily: 'Inter-Medium',
    fontSize: Layout.typography.fontSizes.m,
    color: Colors.dark.text,
    flex: 1,
  },
  logoutContainer: {
    marginTop: 'auto',
    marginBottom: Layout.spacing.xl,
  },
});