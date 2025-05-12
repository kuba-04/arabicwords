import React, { useEffect, useState, useRef } from 'react';
import { View, Platform, ScrollView, ActivityIndicator, TextInput, KeyboardAvoidingView } from 'react-native';
import { getWords, WordsResponse } from '../api/words';
import { Input } from "../../components/Input";
import { Label } from "../../components/Label";
import { Text } from "../../components/Text";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";

export default function WordsScreen() {
  const [data, setData] = useState<WordsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<TextInput>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

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

  function handleOnLabelPress() {
    if (!inputRef.current) return;
    if (inputRef.current.isFocused()) {
      inputRef.current?.blur();
    } else {
      inputRef.current?.focus();
    }
  }

  function onChangeText(text: string) {
    if (searchError) {
      setSearchError(null);
    }
    setSearchQuery(text);
  }

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

  const filteredWords = data?.data.filter(word => 
    word.english_term.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (word.english_definition?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    word.primary_arabic_script.includes(searchQuery)
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <View className="flex-1">
        <ScrollView 
          className="flex-1 px-4 pb-24"
        >
          <Text className="text-xl font-bold m-10 text-center mt-20">Arabic Words</Text>
          {filteredWords?.map((word) => (
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
        
        <View className="absolute mx-5 bottom-36 left-0 right-0 bg-gray-100 rounded-xl px-4 py-2 border-t border-gray-200 shadow-sm">
            <Input
              ref={inputRef}
              placeholder="Enter an Arabic or English word"
              value={searchQuery}
              onChangeText={onChangeText}
              aria-labelledby="searchLabel"
              aria-errormessage="searchError"
              className="text-xl"
            />
            {searchError && <ErrorMessage msg={searchError} />}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function ErrorMessage({ msg }: { msg: string }) {
  if (Platform.OS === "web") {
    return (
      <Text
        className="text-destructive text-sm native:px-1 py-1.5 web:animate-in web:zoom-in-95"
        aria-invalid="true"
        id="searchError"
      >
        {msg}
      </Text>
    );
  }
  return (
    <Animated.Text
      entering={FadeInDown}
      exiting={FadeOut.duration(275)}
      className="text-destructive text-sm native:px-1 py-1.5"
      aria-invalid="true"
      id="searchError"
    >
      {msg}
    </Animated.Text>
  );
} 