import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { getWords, WordsResponse } from '../api/words';

export default function WordsScreen() {
  const [data, setData] = useState<WordsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = async () => {
    try {
      const response = await getWords({});
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-4">
      <Text className="text-xl font-bold mb-4">Arabic Words</Text>
      {data?.data.map((word) => (
        <View key={word.id} className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <Text className="text-lg font-semibold">{word.english_term}</Text>
          <Text className="text-xl my-2">{word.primary_arabic_script}</Text>
          <Text>{word.english_definition}</Text>
          <Text className="text-sm text-gray-500 mt-2">
            {word.part_of_speech} • {word.general_frequency_tag}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
} 