import { Button } from 'react-native';
import Constants from 'expo-constants';

export function ExampleComponent() {
  // Access environment variables through Constants.expoConfig.extra
  const apiUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL;

  async function onPress() {
    if (!apiUrl) {
      console.error('API URL not configured');
      return;
    }
    
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log('Response:', data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  return <Button onPress={onPress} title="Make API Call" />;
} 

export default ExampleComponent;