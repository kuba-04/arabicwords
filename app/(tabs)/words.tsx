import React, { useEffect, useState, useRef } from 'react';
import { View, Platform, ScrollView, ActivityIndicator, TextInput, KeyboardAvoidingView, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { getWords } from '../api/words';
import { WordDTO, WordsResponse } from '../types';
import { Input } from "../../components/Input";
import { Text } from "../../components/Text";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";

// Import flag images
const lbFlag = require('../../assets/images/flags/lb.png');
const saFlag = require('../../assets/images/flags/sa.png');
const egFlag = require('../../assets/images/flags/eg.png');

const WordItem = ({ word }: { word: WordDTO }) => {
  const router = useRouter();
  
  return (
    <Pressable 
      onPress={() => router.push(`/word/${word.id}`)}
      className="flex-row items-center py-3 border-b border-gray-200 active:bg-gray-50"
    >
      <View className="flex-1">
        <Text className="text-2xl mb-1 font-arabic">{word.primary_arabic_script}</Text>
        <View className="flex-row items-center">
          <Text className="text-gray-600">({word.part_of_speech}) - </Text>
          <Text className="text-gray-800">{word.english_term}</Text>
          <View className="flex-row ml-2">
            <Image 
              source={lbFlag}
              className="w-5 h-3 mx-0.5"
            />
            <Image 
              source={saFlag}
              className="w-5 h-3 mx-0.5"
            />
            <Image 
              source={egFlag}
              className="w-5 h-3 mx-0.5"
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

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

  const searchWords = async (query: string) => {
    try {
      const isArabic = /[\u0600-\u06FF]/.test(query);
      const response = await getWords({
        ...(isArabic ? { arabic: query } : { english: query })
      });
      setData(response);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  async function onChangeText(text: string) {
    setSearchQuery(text);
    if (searchError) {
      setSearchError(null);
    }
    
    if (text.length >= 2) {
      await searchWords(text);
    } else if (text.length === 0) {
      await loadWords();
    }
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <View className="flex-1">
        <View className="absolute bottom-0 left-0 right-0 bg-white">
          <ScrollView 
            className="max-h-96 px-4"
            keyboardShouldPersistTaps="handled"
          >
            {loading ? (
              <View className="py-8 justify-center items-center">
                <ActivityIndicator size="large" />
              </View>
            ) : (
              data?.data.map((word: WordDTO) => (
                <WordItem key={word.id} word={word} />
              ))
            )}
          </ScrollView>
          
          <View className="mt-5 mx-5 mb-36 bg-gray-100 rounded-xl px-4 py-2 border-t border-gray-200 shadow-sm">
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