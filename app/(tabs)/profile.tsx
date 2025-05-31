import React from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { supabase } from '../lib/supabase';
import { AuthService } from '../lib/services/auth.service';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoginView, setIsLoginView] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<{ email: string | undefined } | null>(null);

  React.useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        setUser({ email: session.user.email! });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await AuthService.login({ email, password });
      setIsAuthenticated(true);
      if (!result.user.email) throw new Error('No email returned from login');
      setUser({ email: result.user.email });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await AuthService.register({ email, password });
      setIsAuthenticated(true);
      setUser({ email: result.user.email });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUser(null);
      setEmail('');
      setPassword('');
    } catch (error) {
      setError('Failed to logout');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              setError(null);
              await AuthService.deleteAccount();
              setIsAuthenticated(false);
              setUser(null);
              setEmail('');
              setPassword('');
            } catch (error) {
              setError(error instanceof Error ? error.message : 'Failed to delete account');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    text: {
      fontSize: 16,
      marginBottom: 10,
    },
    formContainer: {
      width: '100%',
      gap: 10,
      marginBottom: 20,
    },
    input: {
      width: '100%',
      padding: 15,
      borderRadius: 10,
      borderWidth: 1,
      fontSize: 16,
    },
    errorText: {
      fontSize: 14,
      marginTop: 5,
    },
    buttonContainer: {
      width: '100%',
      gap: 10,
    },
    button: {
      width: '100%',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    switchButton: {
      width: '100%',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      borderWidth: 1,
    },
    switchButtonText: {
      fontSize: 14,
      fontWeight: '500',
    },
    profileInfo: {
      width: '100%',
      marginBottom: 20,
    },
    deleteButton: {
      width: '100%',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      backgroundColor: '#fecaca', // red-200 color
      marginTop: 10,
      borderWidth: 1,
      borderColor: '#dc2626', // red-600 color for border
    },
    deleteButtonText: {
      color: '#dc2626', // red-600 color for text
      fontSize: 16,
      fontWeight: '600',
    },
  });

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
          Welcome to Arabic Words
        </Text>
        <View style={styles.formContainer}>
          <TextInput
            style={[styles.input, { 
              color: Colors[colorScheme ?? 'light'].text,
              borderColor: Colors[colorScheme ?? 'light'].tint 
            }]}
            placeholder="Email"
            placeholderTextColor={Colors[colorScheme ?? 'light'].text}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={[styles.input, { 
              color: Colors[colorScheme ?? 'light'].text,
              borderColor: Colors[colorScheme ?? 'light'].tint 
            }]}
            placeholder="Password"
            placeholderTextColor={Colors[colorScheme ?? 'light'].text}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {error && (
            <Text style={[styles.errorText, { color: 'red' }]}>
              {error}
            </Text>
          )}
        </View>
        <View style={styles.buttonContainer}>
          {isLoginView ? (
            <>
              <Pressable
                style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
                onPress={handleLogin}
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Log In</Text>
                )}
              </Pressable>
              <Pressable
                style={[styles.switchButton, { borderColor: Colors[colorScheme ?? 'light'].tint }]}
                onPress={() => setIsLoginView(false)}
                disabled={loading}>
                <Text style={[styles.switchButtonText, { color: Colors[colorScheme ?? 'light'].tint }]}>
                  Don't have an account? Register
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable
                style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
                onPress={handleRegister}
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Register</Text>
                )}
              </Pressable>
              <Pressable
                style={[styles.switchButton, { borderColor: Colors[colorScheme ?? 'light'].tint }]}
                onPress={() => setIsLoginView(true)}
                disabled={loading}>
                <Text style={[styles.switchButtonText, { color: Colors[colorScheme ?? 'light'].tint }]}>
                  Already have an account? Log In
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
        Your Profile
      </Text>
      <View style={styles.profileInfo}>
        <Text style={[styles.text, { color: Colors[colorScheme ?? 'light'].text }]}>
          Email: {user?.email}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
          onPress={handleLogout}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Log Out</Text>
          )}
        </Pressable>
        <Pressable
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#dc2626" />
          ) : (
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          )}
        </Pressable>
      </View>
      {error && (
        <Text style={[styles.errorText, { color: 'red' }]}>
          {error}
        </Text>
      )}
    </View>
  );
} 