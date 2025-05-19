import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoginView, setIsLoginView] = React.useState(true);

  const handleLogin = () => {
    // TODO: Implement login logic
    setIsAuthenticated(true);
  };

  const handleRegister = () => {
    // TODO: Implement registration logic
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
          Welcome to Arabic Words
        </Text>
        <View style={styles.buttonContainer}>
          {isLoginView ? (
            <>
              <Pressable
                style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
                onPress={handleLogin}>
                <Text style={styles.buttonText}>Log In</Text>
              </Pressable>
              <Pressable
                style={[styles.switchButton, { borderColor: Colors[colorScheme ?? 'light'].tint }]}
                onPress={() => setIsLoginView(false)}>
                <Text style={[styles.switchButtonText, { color: Colors[colorScheme ?? 'light'].tint }]}>
                  Don't have an account? Register
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable
                style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
                onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
              </Pressable>
              <Pressable
                style={[styles.switchButton, { borderColor: Colors[colorScheme ?? 'light'].tint }]}
                onPress={() => setIsLoginView(true)}>
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
          Email: user@example.com
        </Text>
        {/* Add more profile information here */}
      </View>
      <Pressable
        style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
        onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </Pressable>
    </View>
  );
}

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
}); 