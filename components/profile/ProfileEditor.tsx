import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { User } from 'lucide-react-native';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

interface ProfileEditorProps {
  onComplete: () => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ onComplete }) => {
  const { user, updateProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await updateProfile({
        displayName,
        email: user?.email || '',
      });
      onComplete();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Input
        label="Username"
        value={displayName}
        onChangeText={setDisplayName}
        leftIcon={<User size={20} color={Colors.dark.textSecondary} />}
      />

      <View style={styles.buttons}>
        <Button
          title="Save Changes"
          onPress={handleSubmit}
          loading={isSubmitting}
          fullWidth
        />
        
        <Button
          title="Cancel"
          onPress={onComplete}
          variant="outline"
          style={styles.cancelButton}
          fullWidth
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Layout.spacing.m,
  },
  buttons: {
    marginTop: Layout.spacing.xl,
  },
  cancelButton: {
    marginTop: Layout.spacing.m,
  },
});

export default ProfileEditor;